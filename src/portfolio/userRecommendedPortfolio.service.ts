import { Injectable, Logger } from '@nestjs/common';
import {
  OptimizerService,
  OptimizerRecommendedResponse,
  PortfolioOptimizerProps,
  ManagementWorkflowKey,
} from '../optimizer/optimizer.service';
import { BaseService } from '../shared/base.service';
import { UserRecommendedPortfolio } from './entities/userRecommendedPortfolio.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestError, NotFoundError } from '../shared/errors';
import { InvestmentValue as InvestmentValueRecord } from '../investment-value/entities/investmentValue.entity';
import { QueryOrder } from '@mikro-orm/core';
import { AssetClass } from '../asset-class/entities/assetClass.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  USER_MANAGED_PORTFOLIO_CHANGED,
  UserManagedPortfolioChangedEvent,
} from './events';
import {
  Group,
  hashPreferences,
  InvestmentValue,
} from './utils/hashPreferences';
import { GetUserRecommendedPortfolioAssetsArgs } from './dto/getUserRecommendedPortfolioAssets.args';
import { RecommendedPortfolioAssetResponseItem } from './dto/recommendedPortfolioAssetResponseItem';
import { RiskLevel } from '../risk-level/entities/riskLevel.entity';
import { InvestmentPreferencesService } from '../investment-preferences/investmentPreferences.service';
import { UserInvestmentPreferences } from '../investment-preferences/dto/userInvestmentPreferences';

@Injectable()
export class UserRecommendedPortfolioService extends BaseService<UserRecommendedPortfolio> {
  protected readonly logger: Logger;
  public constructor(
    private readonly optimizerService: OptimizerService,
    @InjectRepository(UserRecommendedPortfolio)
    private readonly userRecommendedPortfolioRepo: EntityRepository<UserRecommendedPortfolio>,
    private readonly investmentPreferencesService: InvestmentPreferencesService,
    private readonly eventEmitter: EventEmitter2
  ) {
    super(userRecommendedPortfolioRepo);
    this.logger = new Logger(UserRecommendedPortfolioService.name);
  }

  public async getRecommendedPortfolio(
    userId: string,
    args: GetUserRecommendedPortfolioAssetsArgs
  ): Promise<RecommendedPortfolioAssetResponseItem[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const { assetClassIdList, investmentValueIdList } = args;

    if (
      (assetClassIdList && assetClassIdList.length) ||
      (investmentValueIdList && investmentValueIdList.length)
    ) {
      return await this.getDynamicPortfolio({
        userId,
        assetClassIdList,
        investmentValueIdList,
      });
    }

    const recommendedPortfolioList: UserRecommendedPortfolio[] =
      await this.getByUserId(userId);

    return recommendedPortfolioList.map(
      (item) =>
        new RecommendedPortfolioAssetResponseItem({
          id: item.id,
          asset: item.asset,
          weight: item.weight,
        })
    );
  }

  public async getByUserId(
    userId: string
  ): Promise<UserRecommendedPortfolio[]> {
    return await this.find(
      { userId },
      {
        orderBy: {
          weight: QueryOrder.ASC,
        },
      }
    );
  }

  public async setRecommendedPortfolio(props: {
    userId: string;
    riskLevel: RiskLevel;
    investmentValueList: InvestmentValueRecord[];
    assetClassList: AssetClass[];
  }): Promise<UserRecommendedPortfolio[]> {
    if (!this.investmentPreferencesService.preferencesCollected(props)) {
      throw new BadRequestError('Some investment preferences are missing');
    }

    const optimizerProps = this.getOptimizerProps(props);
    const { assets, weights }: OptimizerRecommendedResponse =
      await this.optimizerService.optimizePortfolio(optimizerProps);

    const userRecommendedPortfolioList: UserRecommendedPortfolio[] = assets.map(
      (asset, idx) =>
        this.create({
          userId: props.userId,
          asset,
          weight: weights[idx],
        })
    );

    const recommendedPortfolioList: UserRecommendedPortfolio[] =
      await this.find({ userId: props.userId });
    await this.remove(recommendedPortfolioList);
    await this.persistAndFlush(userRecommendedPortfolioList);

    await this.eventEmitter.emitAsync(
      USER_MANAGED_PORTFOLIO_CHANGED,
      new UserManagedPortfolioChangedEvent({
        userId: props.userId,
        allioPortfolioId: hashPreferences(
          (optimizerProps.investment_values as InvestmentValue[]) || [],
          optimizerProps.groups as Group[],
          optimizerProps.risk_tolerance
        ),
        assets,
        weights,
      })
    );

    return userRecommendedPortfolioList;
  }

  private getOptimizerProps({
    investmentValueList,
    assetClassList,
    riskLevel,
  }: UserInvestmentPreferences): PortfolioOptimizerProps {
    const props: PortfolioOptimizerProps = {
      workflow: ManagementWorkflowKey.auto,
      risk_tolerance: riskLevel.riskLevel,
      groups: assetClassList.map((assetClass) => assetClass.name),
    };

    if (investmentValueList && investmentValueList.length) {
      props.investment_values = investmentValueList.map(
        ({ investmentValue }) => investmentValue
      );
    }

    return props;
  }

  private async getDynamicPortfolio(props: {
    userId: string;
    assetClassIdList?: string[];
    investmentValueIdList?: string[];
  }): Promise<RecommendedPortfolioAssetResponseItem[]> {
    const userInvestmentPreferences: UserInvestmentPreferences =
      await this.investmentPreferencesService.getUserDynamicInvestmentPreferences(
        props
      );

    if (
      !this.investmentPreferencesService.preferencesCollected(
        userInvestmentPreferences
      )
    ) {
      return [];
    }

    const optimizerProps = this.getOptimizerProps(userInvestmentPreferences);
    const { assets, weights }: OptimizerRecommendedResponse =
      await this.optimizerService.optimizePortfolio(optimizerProps);

    return assets.map(
      (asset, idx) =>
        new RecommendedPortfolioAssetResponseItem({
          id: asset,
          asset,
          weight: weights[idx],
        })
    );
  }
}

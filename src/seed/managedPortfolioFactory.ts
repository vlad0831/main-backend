import { Injectable, Logger } from '@nestjs/common';
import { ManagedPortfolioService } from '../managed-portfolio/managedPortfolio.service';
import { UserRiskLevelService } from '../risk-level/userRiskLevel.service';
import { UserAssetClassService } from '../user-asset-class/userAssetClass.service';
import { SeedConfig } from './seed.config';
import { UserInvestmentValueService } from '../investment-value/userInvestmentValue.service';
import {
  Group,
  hashPreferences,
  InvestmentValue,
} from '../portfolio/utils/hashPreferences';
import { UserRecommendedPortfolioService } from '../portfolio/userRecommendedPortfolio.service';
import { UserRecommendedPortfolio } from '../portfolio/entities/userRecommendedPortfolio.entity';

@Injectable()
export class ManagedPortfolioFactory {
  private readonly logger: Logger;

  public constructor(
    private readonly managedPortfolioService: ManagedPortfolioService,
    private readonly userRiskLevelService: UserRiskLevelService,
    private readonly userInvestmentValuesService: UserInvestmentValueService,
    private readonly userAssetClassListService: UserAssetClassService,
    private readonly userRecommendedPortfolioService: UserRecommendedPortfolioService,
    private readonly seedConfig: SeedConfig
  ) {
    this.logger = new Logger(ManagedPortfolioFactory.name);
  }

  public async create() {
    const userId = this.seedConfig.getUserId();
    const userRiskLevel = await this.userRiskLevelService.findOneOrFail(
      { userId },
      { populate: { riskLevel: true } }
    );
    const userInvestmentValues = await this.userInvestmentValuesService.find(
      { userId },
      { populate: { investmentValue: true } }
    );
    const userAssetClassList = await this.userAssetClassListService.find(
      { userId },
      { populate: { assetClass: true } }
    );
    const allioPortfolioId = hashPreferences(
      userInvestmentValues.map(
        (value) => value.investmentValue.investmentValue
      ) as InvestmentValue[],
      userAssetClassList.map((item) => item.assetClass.name) as Group[],
      userRiskLevel.riskLevel.riskLevel
    );

    const managedPortfolio = await this.managedPortfolioService.findOne({
      allioPortfolioId,
    });
    if (!managedPortfolio) {
      const recommendedPortfolio: UserRecommendedPortfolio[] =
        await this.userRecommendedPortfolioService.getByUserId(userId);
      const { assets, weights } = recommendedPortfolio.reduce(
        (accObj, item) => {
          accObj.assets.push(item.asset);
          accObj.weights.push(item.weight);
          return accObj;
        },
        { assets: [], weights: [] }
      );
      await this.managedPortfolioService.findOrCreate({
        allioPortfolioId,
        assets,
        weights,
      });
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { ManagedPortfolio } from './entities/managedPortfolio.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { DriveWealthService } from '../drivewealth/drivewealth.service';
import { BadRequestError } from '../shared/errors';
import { MANAGED_FUND_KEY, MANAGED_PORTFOLIO_KEY } from './constants';
import { AllocationNormalizer } from './allocationNormalizer';
import {
  Fund,
  FundSettings,
  Instrument,
  Portfolio,
} from '../drivewealth/types';

@Injectable()
export class ManagedPortfolioService extends BaseService<ManagedPortfolio> {
  protected logger: Logger;
  private dwInstrumentMap: Record<string, string>;

  public constructor(
    @InjectRepository(ManagedPortfolio)
    private readonly managedPortfolioRepo: EntityRepository<ManagedPortfolio>,
    private readonly drivewealthService: DriveWealthService,
    private readonly allocationNormalizer: AllocationNormalizer
  ) {
    super(managedPortfolioRepo);
    this.logger = new Logger(ManagedPortfolioService.name);
  }

  public async findByAllioId(
    allioPortfolioId: string
  ): Promise<ManagedPortfolio> {
    const managedPortfolio: ManagedPortfolio = await this.findOne({
      allioPortfolioId,
    });
    return managedPortfolio;
  }

  public async findOrCreate({
    allioPortfolioId,
    assets,
    weights,
  }: {
    allioPortfolioId: string;
    assets: string[];
    weights: number[];
  }): Promise<ManagedPortfolio> {
    let managedPortfolio: ManagedPortfolio = await this.findByAllioId(
      allioPortfolioId
    );

    if (!managedPortfolio) {
      managedPortfolio = await this.createManagedPortfolio({
        allioPortfolioId,
        assets,
        weights,
      });
    }

    return managedPortfolio;
  }

  private async createManagedPortfolio(props: {
    allioPortfolioId: string;
    assets: string[];
    weights: number[];
  }): Promise<ManagedPortfolio> {
    const dwFund: Fund = await this.createManagedFund(props);
    const portfolioName = `${MANAGED_PORTFOLIO_KEY}|${props.allioPortfolioId}`;
    const dwPortfolio: Portfolio =
      await this.drivewealthService.createManagedPortfolio({
        name: portfolioName,
        clientPortfolioID: props.allioPortfolioId,
        description: portfolioName,
        holdings: [
          {
            fundId: dwFund.id,
            target: 1,
          },
        ],
      });

    const managedPortfolio = this.create({
      allioPortfolioId: props.allioPortfolioId,
      driveWealthPortfolioId: dwPortfolio.id,
      driveWealthFundId: dwFund.id,
    });
    await this.persistAndFlush(managedPortfolio);

    return managedPortfolio;
  }

  private async createManagedFund({
    allioPortfolioId,
    assets,
    weights,
  }: {
    allioPortfolioId: string;
    assets: string[];
    weights: number[];
  }): Promise<Fund> {
    const dwInstrumentMap = await this.getInstrumentMap();
    const fundName = `${MANAGED_FUND_KEY}|${allioPortfolioId}`;
    const settings: FundSettings = {
      name: fundName,
      clientFundId: allioPortfolioId,
      description: fundName,
      holdings: assets.map((asset, idx) => {
        const instrumentId = dwInstrumentMap[asset.toUpperCase()];
        if (!instrumentId) {
          throw new BadRequestError(
            `Missing instrumentId for - ${asset.toUpperCase()}`
          );
        }
        return {
          instrumentId,
          target: weights[idx],
        };
      }),
    };

    settings.holdings = this.allocationNormalizer.normaliseWeights(
      settings.holdings
    );

    return await this.drivewealthService.createFund(settings);
  }

  // TODO implement better cache, read instruments from stock table
  private async getInstrumentMap(): Promise<Record<string, string>> {
    if (!this.dwInstrumentMap) {
      const dwInstrumentList: Instrument[] =
        await this.drivewealthService.listInstruments();
      this.dwInstrumentMap = dwInstrumentList.reduce((accObj, item) => {
        accObj[item.symbol.toUpperCase()] = item.id;
        return accObj;
      }, {});
    }

    return this.dwInstrumentMap;
  }
}

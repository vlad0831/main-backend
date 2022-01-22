import { Injectable, Logger } from '@nestjs/common';
import { UserRecommendedPortfolioService } from '../portfolio/userRecommendedPortfolio.service';
import { SeedConfig } from './seed.config';

@Injectable()
export class UserRecommendedPortfolioFactory {
  protected readonly logger: Logger;

  public constructor(
    private readonly userRecommendedPortfolioService: UserRecommendedPortfolioService,
    private readonly seedConfig: SeedConfig
  ) {
    this.logger = new Logger(UserRecommendedPortfolioFactory.name);
  }

  public async create() {
    const userId: string = this.seedConfig.getUserId();
    let assets: string[] = [];
    let weights: number[] = [];
    if (this.seedConfig.isDev) {
      assets = [
        'BIL',
        'VTI',
        'VEA',
        'VWO',
        'VGSH',
        'VGIT',
        'VGLT',
        'LQD',
        'HYG',
        'VWOB',
        'TIP',
        'GLD',
        'PDBC',
        'VNQ',
        'VLUE',
        'QMOM',
        'VIG',
        'BLOK',
        'QQQ',
        'ARKK',
        'IBB',
        'NACP',
        'SHE',
        'ICLN',
        'PHO',
        'BIBL',
      ];
      weights = [
        0.0418200315298352, 0.06198213009283632, 0.03561567043150175,
        0.07942837619688191, 0.03937320905330233, 0.012532581915632076,
        0.010207807294118574, 0.03183061367185195, 0.022278942873372235,
        0.017988674793173103, 0.02372403283690526, 0.05538830895234116,
        0.0543641696266379, 0.037967972765268615, 0.031017597281762902,
        0.05009505684633936, 0.061600823225602896, 0.038706778929786,
        0.07209578323864592, 0.0641119091492679, 0.06900401204324036,
        0.026505036230471197, 0.01282527514944814, 0.011158515609255364,
        0.022139178981671025, 0.016237511280850526,
      ];
    }

    if (userId) {
      await this.userRecommendedPortfolioService.nativeDelete({ userId });
    }

    const list = assets.map((asset, idx) =>
      this.userRecommendedPortfolioService.create({
        userId,
        asset,
        weight: weights[idx],
      })
    );

    await this.userRecommendedPortfolioService.persistAndFlush(list);
  }
}

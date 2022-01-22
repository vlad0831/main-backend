import { Injectable, Logger } from '@nestjs/common';
import { UserRiskLevel } from '../risk-level/entities/userRiskLevel.entity';
import { UserRiskLevelService } from '../risk-level/userRiskLevel.service';
import { SeedConfig } from './seed.config';
import { RiskLevelService } from '../risk-level/riskLevel.service';
import { RiskLevel } from '../risk-level/entities/riskLevel.entity';

@Injectable()
export class UserRiskLevelFactory {
  protected readonly logger: Logger;

  public constructor(
    private readonly riskLevelService: RiskLevelService,
    private readonly userRiskLevelService: UserRiskLevelService,
    private readonly seedConfig: SeedConfig
  ) {
    this.logger = new Logger(UserRiskLevelFactory.name);
  }

  public async create() {
    let userRiskLevel: UserRiskLevel;
    const userId = this.seedConfig.getUserId();
    if (this.seedConfig.isDev) {
      const riskLevel: RiskLevel = await this.riskLevelService.findOneOrFail({
        riskLevel: 4,
      });
      userRiskLevel = this.userRiskLevelService.create({
        riskLevel,
        userId,
      });
    }

    if (userId) {
      await this.userRiskLevelService.nativeDelete({ userId });
    }

    await this.userRiskLevelService.persistAndFlush(userRiskLevel);
  }
}

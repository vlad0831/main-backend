import { UserRiskLevel } from './entities/userRiskLevel.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestError, NotFoundError } from '../shared/errors';
import { Injectable, Logger } from '@nestjs/common';
import { RiskLevelService } from './riskLevel.service';
import { BaseService } from '../shared/base.service';
import { RiskLevel } from './entities/riskLevel.entity';
import { InvestmentQuestionnaireOption } from '../investment-questionnaire/entities/investmentQuestionnaireOption.entity';

@Injectable()
export class UserRiskLevelService extends BaseService<UserRiskLevel> {
  protected logger: Logger;
  public constructor(
    @InjectRepository(UserRiskLevel)
    private readonly userRiskLevelRepository: EntityRepository<UserRiskLevel>,
    private readonly riskLevelService: RiskLevelService
  ) {
    super(userRiskLevelRepository);
    this.logger = new Logger(UserRiskLevelService.name);
  }

  private readonly HighestRiskLevel = 4;
  private readonly LowestRiskLevel = 0;

  private mapQuestionnaireOptionToRiskLevel(
    selectedOption: InvestmentQuestionnaireOption
  ): number {
    const riskLevel = this.HighestRiskLevel - selectedOption.order;
    if (riskLevel > this.HighestRiskLevel || riskLevel < this.LowestRiskLevel) {
      throw new BadRequestError(
        `Risk level must be >= ${this.LowestRiskLevel} and <= ${this.HighestRiskLevel}`
      );
    }
    return riskLevel;
  }

  public async setUserRiskLevel(
    userId: string,
    selectedOption: InvestmentQuestionnaireOption
  ): Promise<UserRiskLevel>;
  public async setUserRiskLevel(
    userId: string,
    riskLevelId: string
  ): Promise<UserRiskLevel>;
  public async setUserRiskLevel(
    userId: string,
    payload: InvestmentQuestionnaireOption | string
  ): Promise<UserRiskLevel> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    let riskLevelRecord: RiskLevel;

    if (payload instanceof InvestmentQuestionnaireOption) {
      const riskLevel: number = this.mapQuestionnaireOptionToRiskLevel(payload);
      riskLevelRecord = await this.riskLevelService.findOneOrFail({
        riskLevel,
      });
    } else {
      riskLevelRecord = await this.riskLevelService.getById(payload);
    }

    let userRiskLevel: UserRiskLevel = await this.getUserRiskLevel(
      userId,
      false
    );

    if (userRiskLevel) {
      userRiskLevel.riskLevel = riskLevelRecord;
    } else {
      userRiskLevel = this.create({
        riskLevel: riskLevelRecord,
        userId,
      });
    }

    await this.persistAndFlush(userRiskLevel);

    return userRiskLevel;
  }

  public async getUserRiskLevel(
    userId: string,
    throwOnMissing = true
  ): Promise<UserRiskLevel> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }
    const userRiskLevel: UserRiskLevel = await this.findOne(
      { userId },
      {
        populate: {
          riskLevel: true,
        },
      }
    );

    if (!userRiskLevel) {
      if (throwOnMissing) {
        throw new NotFoundError('User risk level not found');
      } else {
        this.logger.error('User risk level not found');
      }
    }

    return userRiskLevel;
  }
}

import { Injectable } from '@nestjs/common';
import { UserQuestionnaireAnswerFactory } from './userQuestionnaireAnswerFactory';
import { EntityManager } from '@mikro-orm/core';
import { UserRiskLevelFactory } from './userRiskLevelFactory';
import { UserRecommendedPortfolioFactory } from './userRecommendedPortfolioFactory';
import { UserInvestmentValueFactory } from './userInvestmentValueFactory';
import { UserAssetClassFactory } from './userAssetClassFactory';
import { ManagedPortfolioFactory } from './managedPortfolioFactory';
import { SeedConfig } from './seed.config';
import { UserInvestmentProfileFactory } from './userInvestmentProfileFactory';

@Injectable()
export class DatabaseSeeder {
  public constructor(
    private readonly userQuestionnaireAnswerFactory: UserQuestionnaireAnswerFactory,
    private readonly userRiskLevelFactory: UserRiskLevelFactory,
    private readonly userRecommendedPortfolioFactory: UserRecommendedPortfolioFactory,
    private readonly userInvestmentValueFactory: UserInvestmentValueFactory,
    private readonly userAssetClassFactory: UserAssetClassFactory,
    private readonly managedPortfolioFactory: ManagedPortfolioFactory,
    private readonly userInvestmentProfileFactory: UserInvestmentProfileFactory,
    private readonly entityManager: EntityManager,
    private readonly seedConfig: SeedConfig
  ) {}

  public async run() {
    if (!this.seedConfig.isDev) {
      return;
    }

    await this.userQuestionnaireAnswerFactory.create();
    await this.userRiskLevelFactory.create();
    await this.userInvestmentValueFactory.create();
    await this.userAssetClassFactory.create();
    await this.userRecommendedPortfolioFactory.create();
    await this.managedPortfolioFactory.create();
    await this.userInvestmentProfileFactory.create();
    await this.entityManager.flush();
  }
}

import { Module } from '@nestjs/common';
import { UserQuestionnaireAnswerFactory } from './userQuestionnaireAnswerFactory';
import { DatabaseSeeder } from './databaseSeeder';
import {
  loadConfigModule,
  loadMikroOrmModule,
} from '../shared/utils/loadModule';
import { SeedConfig } from './seed.config';
import { UserInvestmentQuestionnaireModule } from '../user-investment-questionnaire/userInvestmentQuestionnaire.module';
import { InvestmentQuestionnaireModule } from '../investment-questionnaire/investmentQuestionnaire.module';
import { RiskLevelModule } from '../risk-level/riskLevel.module';
import { UserRiskLevelFactory } from './userRiskLevelFactory';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { UserRecommendedPortfolioFactory } from './userRecommendedPortfolioFactory';
import { InvestmentValueModule } from '../investment-value/investmentValue.module';
import { UserInvestmentValueFactory } from './userInvestmentValueFactory';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserAssetClassFactory } from './userAssetClassFactory';
import { UserAssetClassModule } from '../user-asset-class/userAssetClass.module';
import { AssetClassModule } from '../asset-class/assetClass.module';
import { ManagedPortfolioFactory } from './managedPortfolioFactory';
import { ManagedPortfolioModule } from '../managed-portfolio/managedPortfolio.module';
import { OptimizerModule } from '../optimizer/optimizer.module';
import { DrivewealthModule } from '../drivewealth/drivewealth.module';
import { UserInvestmentProfileModule } from '../user-investment-profile/userInvestmentProfile.module';
import { UserInvestmentProfileFactory } from './userInvestmentProfileFactory';

@Module({
  imports: [
    loadMikroOrmModule(),
    loadConfigModule(),
    UserInvestmentQuestionnaireModule,
    InvestmentQuestionnaireModule,
    RiskLevelModule,
    PortfolioModule,
    InvestmentValueModule,
    UserAssetClassModule,
    AssetClassModule,
    EventEmitterModule.forRoot(),
    ManagedPortfolioModule,
    OptimizerModule,
    DrivewealthModule,
    UserInvestmentProfileModule,
  ],
  providers: [
    DatabaseSeeder,
    UserQuestionnaireAnswerFactory,
    UserRiskLevelFactory,
    UserRecommendedPortfolioFactory,
    UserInvestmentValueFactory,
    UserAssetClassFactory,
    SeedConfig,
    ManagedPortfolioFactory,
    UserInvestmentProfileFactory,
  ],
})
export class SeederModule {}

import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CaslAbilityFactory } from './auth/casl-ability.factory';
import { GraphQLModule } from '@nestjs/graphql';
import { IS_PROD } from './shared/constants';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { InvestmentQuestionnaireModule } from './investment-questionnaire/investmentQuestionnaire.module';
import { UserInvestmentQuestionnaireModule } from './user-investment-questionnaire/userInvestmentQuestionnaire.module';
import { RiskLevelModule } from './risk-level/riskLevel.module';
import { AssetClassModule } from './asset-class/assetClass.module';
import { UserAssetClassModule } from './user-asset-class/userAssetClass.module';
import { StaticAssetModule } from './static-asset/staticAsset.module';
import { InvestmentValueModule } from './investment-value/investmentValue.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import {
  loadConfigModule,
  loadMikroOrmModule,
} from './shared/utils/loadModule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserFundingMethodModule } from './user-funding-method/userFundingMethod.module';
import { UserPlaidLinkedItemModule } from './user-plaid-linked-item/userPlaidLinkedItem.module';
import { PlaidModule } from './plaid/plaid.module';
import { UserFundingTransactionModule } from './user-funding-transaction/userFundingTransaction.module';
import { UserRecurringFundingSettingModule } from './user-recurring-funding-setting/userRecurringFundingSetting.module';
import { ManagedPortfolioModule } from './managed-portfolio/managedPortfolio.module';
import { DrivewealthModule } from './drivewealth/drivewealth.module';
import { OptimizerModule } from './optimizer/optimizer.module';
import { UserInvestmentProfileModule } from './user-investment-profile/userInvestmentProfile.module';
import { PersonaWebhookModule } from './persona-webhook/personaWebhook.module';
import { UserPersonaInquiryModule } from './user-persona-inquiry/userPersonaInquiry.module';
import { PersonaWebhookEventModule } from './persona-webhook-event/personaWebhookEvent.module';
import { UserStockModule } from './user-stock/userStock.module';
import { InvestmentPreferencesModule } from './investment-preferences/investmentPreferences.module';
import { PersonaApiModule } from './persona-api/personaApi.module';
import { UserRequiredPersonaInquiryModule } from './user-required-persona-inquiry/userRequiredPersonaInquiry.module';
import { UserInvestmentStatementModule } from './user-investment-statement/userInvestmentStatement.module';

@Module({
  imports: [
    loadMikroOrmModule(),
    loadConfigModule(),
    GraphQLModule.forRoot({
      debug: !IS_PROD,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      disableHealthCheck: true,
      autoSchemaFile: join(process.cwd(), 'graphQL/schema.gql'),
      sortSchema: true,
    }),
    AuthModule,
    PlaidModule,
    InvestmentQuestionnaireModule,
    UserInvestmentQuestionnaireModule,
    RiskLevelModule,
    AssetClassModule,
    UserAssetClassModule,
    StaticAssetModule,
    InvestmentValueModule,
    PortfolioModule,
    EventEmitterModule.forRoot(),
    UserFundingMethodModule,
    UserPlaidLinkedItemModule,
    UserFundingTransactionModule,
    UserRecurringFundingSettingModule,
    ManagedPortfolioModule,
    DrivewealthModule,
    OptimizerModule,
    UserInvestmentProfileModule,
    UserPersonaInquiryModule,
    PersonaWebhookEventModule,
    PersonaWebhookModule,
    UserStockModule,
    InvestmentPreferencesModule,
    PersonaApiModule,
    UserRequiredPersonaInquiryModule,
    UserInvestmentStatementModule,
  ],
  controllers: [AppController],
  providers: [AppService, CaslAbilityFactory],
})
export class AppModule {}

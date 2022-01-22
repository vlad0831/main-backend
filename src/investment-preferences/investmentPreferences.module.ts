import { Module } from '@nestjs/common';
import { InvestmentPreferencesResolver } from './investmentPreferences.resolver';
import { InvestmentPreferencesService } from './investmentPreferences.service';
import { AssetClassModule } from '../asset-class/assetClass.module';
import { UserAssetClassModule } from '../user-asset-class/userAssetClass.module';
import { InvestmentValueModule } from '../investment-value/investmentValue.module';
import { RiskLevelModule } from '../risk-level/riskLevel.module';
import { AuthModule } from '../auth/auth.module';
import { InvestmentPreferencesListener } from './event-listeners/investmentPreferences.listener';

@Module({
  imports: [
    AssetClassModule,
    UserAssetClassModule,
    InvestmentValueModule,
    RiskLevelModule,
    AuthModule,
  ],
  providers: [
    InvestmentPreferencesResolver,
    InvestmentPreferencesService,
    InvestmentPreferencesListener,
  ],
  exports: [InvestmentPreferencesService],
})
export class InvestmentPreferencesModule {}

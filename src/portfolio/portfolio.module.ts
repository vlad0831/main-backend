import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserRecommendedPortfolio } from './entities/userRecommendedPortfolio.entity';
import { UserRecommendedPortfolioService } from './userRecommendedPortfolio.service';
import { PortfolioResolver } from './portfolio.resolver';
import { AuthModule } from '../auth/auth.module';
import { UserRecommendedPortfolioListener } from './event-listeners/userRecommendedPortfolio.listener';
import { OptimizerModule } from '../optimizer/optimizer.module';
import { InvestmentPreferencesModule } from '../investment-preferences/investmentPreferences.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserRecommendedPortfolio]),
    AuthModule,
    OptimizerModule,
    InvestmentPreferencesModule,
  ],
  providers: [
    UserRecommendedPortfolioService,
    PortfolioResolver,
    UserRecommendedPortfolioListener,
  ],
  exports: [UserRecommendedPortfolioService],
})
export class PortfolioModule {}

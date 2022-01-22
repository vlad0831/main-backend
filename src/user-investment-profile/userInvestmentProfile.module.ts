import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserInvestmentProfile } from './entities/userInvestmentProfile.entity';
import { UserInvestmentProfileService } from './userInvestmentProfile.service';
import { DrivewealthModule } from '../drivewealth/drivewealth.module';
import { ManagedPortfolioModule } from '../managed-portfolio/managedPortfolio.module';
import { UserInvestmentProfileListener } from './event-listeners/userInvestmentProfile.listener';
import { UserInvestmentProfileResolver } from './userInvestmentProfile.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserInvestmentProfile]),
    DrivewealthModule,
    ManagedPortfolioModule,
    AuthModule,
  ],
  providers: [
    UserInvestmentProfileService,
    UserInvestmentProfileListener,
    UserInvestmentProfileResolver,
  ],
  exports: [UserInvestmentProfileService],
})
export class UserInvestmentProfileModule {}

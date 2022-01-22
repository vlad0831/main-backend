import { Module } from '@nestjs/common';
import { UserInvestmentStatementService } from './userInvestmentStatement.service';
import { UserInvestmentStatementResolver } from './userInvestmentStatement.resolver';
import { UserInvestmentProfileModule } from '../user-investment-profile/userInvestmentProfile.module';
import { DrivewealthModule } from '../drivewealth/drivewealth.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserInvestmentProfileModule, DrivewealthModule, AuthModule],
  providers: [UserInvestmentStatementService, UserInvestmentStatementResolver],
})
export class UserInvestmentStatementModule {}

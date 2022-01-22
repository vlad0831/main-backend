import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { InvestmentValue } from './entities/investmentValue.entity';
import { UserInvestmentValue } from './entities/userInvestmentValue.entity';
import { InvestmentValueResolver } from './investmentValue.resolver';
import { InvestmentValueService } from './investmentValue.service';
import { UserInvestmentValueService } from './userInvestmentValue.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([InvestmentValue, UserInvestmentValue]),
    AuthModule,
  ],
  providers: [
    InvestmentValueService,
    UserInvestmentValueService,
    InvestmentValueResolver,
  ],
  exports: [UserInvestmentValueService, InvestmentValueService],
})
export class InvestmentValueModule {}

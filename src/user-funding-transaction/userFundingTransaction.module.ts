import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserFundingTransaction } from './entities/userFundingTransaction.entity';
import { UserFundingTransactionResolver } from './userFundingTransaction.resolver';
import { AuthModule } from '../auth/auth.module';
import { UserFundingTransactionService } from './userFundingTransaction.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserFundingTransaction]), AuthModule],
  providers: [UserFundingTransactionResolver, UserFundingTransactionService],
})
export class UserFundingTransactionModule {}

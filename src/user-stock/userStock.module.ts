import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserStockResolver } from './userStock.resolver';

@Module({
  imports: [AuthModule],
  providers: [UserStockResolver],
  exports: [],
})
export class UserStockModule {}

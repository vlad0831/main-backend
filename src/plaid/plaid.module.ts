import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PlaidResolver } from './plaid.resolver';
import { PlaidService } from './plaid.service';

@Module({
  imports: [AuthModule],
  providers: [PlaidService, PlaidResolver],
  exports: [PlaidService],
})
export class PlaidModule {}

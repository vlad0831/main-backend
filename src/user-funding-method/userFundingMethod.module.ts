import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserFundingMethod } from './entities/userFundingMethod.entity';
import { UserFundingMethodResolver } from './userFundingMethod.resolver';
import { UserFundingMethodService } from './userFundingMethod.service';
import { UserPlaidLinkedItemModule } from '../user-plaid-linked-item/userPlaidLinkedItem.module';
import { UserRecurringFundingSettingModule } from '../user-recurring-funding-setting/userRecurringFundingSetting.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserFundingMethod]),
    AuthModule,
    UserPlaidLinkedItemModule,
    UserRecurringFundingSettingModule,
  ],
  providers: [UserFundingMethodResolver, UserFundingMethodService],
})
export class UserFundingMethodModule {}

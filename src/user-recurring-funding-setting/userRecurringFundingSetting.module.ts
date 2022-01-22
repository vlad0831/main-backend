import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserRecurringFundingSetting } from './entities/userRecurringFundingSetting.entity';
import { UserRecurringFundingSettingService } from './userRecurringFundingSetting.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserRecurringFundingSetting])],
  providers: [UserRecurringFundingSettingService],
  exports: [UserRecurringFundingSettingService],
})
export class UserRecurringFundingSettingModule {}

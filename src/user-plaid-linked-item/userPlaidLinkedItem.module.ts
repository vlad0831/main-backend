import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserPlaidLinkedItemResolver } from './userPlaidLinkedItem.resolver';
import { UserPlaidLinkedItemService } from './userPlaidLinkedItem.service';
import { UserPlaidLinkedItem } from './entities/userPlaidLinkedItem.entity';
import { PlaidModule } from '../plaid/plaid.module';
import { AuthModule } from '../auth/auth.module';
import { DrivewealthModule } from '../drivewealth/drivewealth.module';
import { UserInvestmentProfileModule } from '../user-investment-profile/userInvestmentProfile.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserPlaidLinkedItem]),
    PlaidModule,
    AuthModule,
    DrivewealthModule,
    UserInvestmentProfileModule,
  ],
  providers: [UserPlaidLinkedItemService, UserPlaidLinkedItemResolver],
  exports: [UserPlaidLinkedItemService],
})
export class UserPlaidLinkedItemModule {}

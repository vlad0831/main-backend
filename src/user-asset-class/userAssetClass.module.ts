import { Module } from '@nestjs/common';
import { UserAssetClassResolver } from './userAssetClass.resolver';
import { UserAssetClassService } from './userAssetClass.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserAssetClass } from './entities/userAssetClass.entity';
import { AuthModule } from '../auth/auth.module';
import { AssetClassModule } from '../asset-class/assetClass.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserAssetClass]),
    AuthModule,
    AssetClassModule,
  ],
  providers: [UserAssetClassResolver, UserAssetClassService],
  exports: [UserAssetClassService],
})
export class UserAssetClassModule {}

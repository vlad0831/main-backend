import { Module } from '@nestjs/common';
import { AssetClassResolver } from './assetClass.resolver';
import { AssetClassService } from './assetClass.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AssetClass } from './entities/assetClass.entity';

@Module({
  imports: [MikroOrmModule.forFeature([AssetClass])],
  providers: [AssetClassResolver, AssetClassService],
  exports: [AssetClassService],
})
export class AssetClassModule {}

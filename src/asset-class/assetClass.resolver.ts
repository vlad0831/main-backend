import { Args, Query, Resolver } from '@nestjs/graphql';
import { AssetClass } from './entities/assetClass.entity';
import { GetAssetClassListArgs } from './dto/getAssetClassList.args';
import { AssetClassService } from './assetClass.service';

@Resolver()
export class AssetClassResolver {
  public constructor(private readonly assetClassService: AssetClassService) {}

  @Query(() => [AssetClass], { name: 'getAssetClassList' })
  public async getAssetClassList(@Args() args: GetAssetClassListArgs) {
    return this.assetClassService.getAssetClassList(args);
  }
}

import { Injectable } from '@nestjs/common';
import { UserAssetClassService } from '../user-asset-class/userAssetClass.service';
import { AssetClassService } from '../asset-class/assetClass.service';
import { AssetClass } from '../asset-class/entities/assetClass.entity';
import { SeedConfig } from './seed.config';
import { UserAssetClass } from '../user-asset-class/entities/userAssetClass.entity';

@Injectable()
export class UserAssetClassFactory {
  public constructor(
    private readonly userAssetClassService: UserAssetClassService,
    private readonly assetClassService: AssetClassService,
    private readonly seedConfig: SeedConfig
  ) {}

  public async create() {
    const assetClassList: AssetClass[] = await this.assetClassService.find({});
    const userId: string = this.seedConfig.getUserId();
    let userAssetClassList: UserAssetClass[] = [];

    if (this.seedConfig.isDev) {
      userAssetClassList = assetClassList.map((assetClass) =>
        this.userAssetClassService.create({
          userId,
          assetClass,
        })
      );
    }

    if (userId) {
      await this.userAssetClassService.nativeDelete({ userId });
    }

    await this.userAssetClassService.persistAndFlush(userAssetClassList);
  }
}

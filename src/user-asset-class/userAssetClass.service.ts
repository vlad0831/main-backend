import { Injectable, Logger } from '@nestjs/common';
import { AssetClass } from '../asset-class/entities/assetClass.entity';
import { QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserAssetClass } from './entities/userAssetClass.entity';
import { NotFoundError } from '../shared/errors';
import { BaseService } from '../shared/base.service';
import { EntityRepository } from '@mikro-orm/postgresql';
import { AssetClassService } from '../asset-class/assetClass.service';

@Injectable()
export class UserAssetClassService extends BaseService<UserAssetClass> {
  protected logger: Logger;

  public constructor(
    private readonly assetClassService: AssetClassService,
    @InjectRepository(UserAssetClass)
    private readonly userAssetClassRepo: EntityRepository<UserAssetClass>
  ) {
    super(userAssetClassRepo);
    this.logger = new Logger(UserAssetClassService.name);
  }

  public async getUserAssetClassList(
    userId: string,
    throwOnMissing = false
  ): Promise<AssetClass[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const userAssetClassList: UserAssetClass[] = await this.getByUserId(
      userId,
      throwOnMissing
    );

    return userAssetClassList.map((userAsset) => userAsset.assetClass);
  }

  private async getByUserId(
    userId: string,
    throwOnMissing = false
  ): Promise<UserAssetClass[]> {
    const userAssetClassList: UserAssetClass[] = await this.find(
      { userId },
      {
        populate: {
          assetClass: true,
        },
        orderBy: {
          createdAt: QueryOrder.ASC,
        },
      }
    );

    if (userAssetClassList.length === 0) {
      if (throwOnMissing) {
        throw new NotFoundError('User asset classes not found');
      }
    }

    return userAssetClassList;
  }

  public async setUserAssetClassList(
    userId: string,
    assetClassIdList: string[]
  ): Promise<AssetClass[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const assetClassList = await this.assetClassService.findByIdList(
      assetClassIdList
    );

    if (assetClassIdList.length !== assetClassList.length) {
      const missingAssetClassId = assetClassIdList.find(
        (id) => !assetClassList.some((asset) => asset.id === id)
      );
      throw new NotFoundError('Asset class not found', {
        assetClassId: missingAssetClassId,
      });
    }

    await this.persistUserAssetClassList(userId, assetClassList);

    return assetClassList;
  }

  private async persistUserAssetClassList(
    userId: string,
    assetClassList: AssetClass[]
  ): Promise<UserAssetClass[]> {
    const userAssetClassList: UserAssetClass[] = assetClassList.map(
      (assetClass) =>
        this.create({
          userId,
          assetClass,
        })
    );
    await this.nativeDelete({ userId });
    await this.persistAndFlush(userAssetClassList);

    return userAssetClassList;
  }
}

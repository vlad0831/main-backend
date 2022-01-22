import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { QueryOrder } from '@mikro-orm/core';
import { AssetClass } from './entities/assetClass.entity';
import { GetAssetClassListArgs } from './dto/getAssetClassList.args';
import { FilterQuery } from '@mikro-orm/core/typings';
import { NotFoundError } from '../shared/errors';
import { BaseService } from '../shared/base.service';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class AssetClassService extends BaseService<AssetClass> {
  protected logger: Logger;
  public constructor(
    @InjectRepository(AssetClass)
    private readonly assetClassRepo: EntityRepository<AssetClass>
  ) {
    super(assetClassRepo);
    this.logger = new Logger(AssetClassService.name);
  }

  public async getAssetClassList(
    args: GetAssetClassListArgs = {}
  ): Promise<AssetClass[]> {
    const { idList } = args;
    const filterById = idList && idList.length > 0;
    const where: FilterQuery<AssetClass> = filterById
      ? { id: { $in: idList } }
      : {};

    const list: AssetClass[] = await this.find(where, {
      orderBy: {
        createdAt: QueryOrder.ASC,
      },
    });

    if (filterById && list.length !== idList.length) {
      const missingAssetId = idList.find(
        (id) => !list.some((asset) => asset.id === id)
      );
      throw new NotFoundError('Asset class not found', {
        assetClassId: missingAssetId,
      });
    }

    return list;
  }
}

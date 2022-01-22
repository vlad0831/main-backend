import { Injectable } from '@nestjs/common';
import { GetStaticAssetListArgs } from './dto/getStaticAssetList.args';
import { InjectRepository } from '@mikro-orm/nestjs';
import { MikroORM, QueryOrder } from '@mikro-orm/core';
import { S3StaticAsset } from './entities/s3StaticAsset.entity';
import { TextStaticAsset } from './entities/textStaticAsset.entity';
import {
  AssetTableName,
  StaticAssetAllocation,
} from './entities/staticAssetAllocation.entity';
import { OperatorMap, Query } from '@mikro-orm/core/typings';
import { TypeStaticAsset } from './interfaces/enums';
import { StaticAssetResponseItem } from './dto/staticAssetResponseItem';
import {
  SetStaticAssetListArgs,
  StaticAssetAllocationInput,
} from './dto/setStaticAssetList.args';
import { NotFoundError } from '../shared/errors';
import { EntityRepository, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { v4 } from 'uuid';

interface IStaticAssetMap {
  textStaticAsset: Record<string, TextStaticAsset>;
  s3StaticAsset: Record<string, S3StaticAsset>;
}

interface IAllocationListWithAsset {
  staticAssetResponseList: StaticAssetResponseItem[];
  assetAllocationList: StaticAssetAllocation[];
  assetList: Array<TextStaticAsset | S3StaticAsset>;
}

@Injectable()
export class StaticAssetService {
  public constructor(
    @InjectRepository(S3StaticAsset)
    private readonly s3StaticAssetRepo: EntityRepository<S3StaticAsset>,
    @InjectRepository(TextStaticAsset)
    private readonly textStaticAssetRepo: EntityRepository<TextStaticAsset>,
    @InjectRepository(StaticAssetAllocation)
    private readonly staticAssetAllocationRepo: EntityRepository<StaticAssetAllocation>,
    private readonly orm: MikroORM<PostgreSqlDriver>
  ) {}

  public async getStaticAssetList(
    args: GetStaticAssetListArgs
  ): Promise<StaticAssetResponseItem[]> {
    const { categoryList, typeList, nameList } = args;
    const hasCategoryFilter = categoryList && categoryList.length > 0;
    const hasTypeFilter = typeList && typeList.length > 0;
    const hasNameFilter = nameList && nameList.length > 0;

    if (!hasCategoryFilter && !hasTypeFilter && !hasNameFilter) {
      return [];
    }

    const operatorMap: OperatorMap<StaticAssetAllocation> = { $and: [] };
    if (hasCategoryFilter) {
      categoryList.forEach((categoryItem) => {
        const filter: Query<StaticAssetAllocation> = {
          category: categoryItem.category,
        };
        if (categoryItem.orderList) {
          filter.order = { $in: categoryItem.orderList };
        }
        operatorMap.$and.push(filter);
      });
    }
    if (hasTypeFilter) {
      const assetTableNameList: AssetTableName[] = [];
      typeList.forEach((typeItem) => {
        if (typeItem === TypeStaticAsset.Text) {
          assetTableNameList.push(AssetTableName.TextStaticAsset);
        } else if (
          typeItem === TypeStaticAsset.Image ||
          typeItem === TypeStaticAsset.Animation
        ) {
          assetTableNameList.push(AssetTableName.S3StaticAsset);
        }
      });
      operatorMap.$and.push({ assetTable: { $in: assetTableNameList } });
    }
    if (hasNameFilter) {
      operatorMap.$and.push({ name: { $in: nameList } });
    }

    const assetAllocationList: StaticAssetAllocation[] =
      await this.staticAssetAllocationRepo.find(
        {
          // for now retrieve only public static assets
          role: '{}',
          ...operatorMap,
        },
        {
          orderBy: {
            category: QueryOrder.ASC,
            order: QueryOrder.ASC,
          },
        }
      );

    if (assetAllocationList.length === 0) {
      return [];
    }

    const assetMap: IStaticAssetMap = await this.getAssetMapFromAllocationList(
      assetAllocationList
    );

    return this.mapAssetResponse(assetAllocationList, assetMap);
  }

  public async setStaticAssetList(
    args: SetStaticAssetListArgs
  ): Promise<StaticAssetResponseItem[]> {
    const { staticAssetInputList } = args;
    if (!staticAssetInputList.length) {
      return [];
    }

    let globalAllocationList: StaticAssetAllocation[] = [];
    let globalStaticAssetResponseList: StaticAssetResponseItem[] = [];
    let globalStaticAssetList: Array<TextStaticAsset | S3StaticAsset> = [];

    const insertInputList: StaticAssetAllocationInput[] = [];
    const updateInput: Record<string, StaticAssetAllocationInput> = {};
    let hasUpdateInput = false;

    staticAssetInputList.forEach((input) => {
      if (input.id) {
        updateInput[input.id] = input;
        hasUpdateInput = true;
      } else {
        insertInputList.push(input);
      }
    });

    const allocationListWithAsset: IAllocationListWithAsset[] = [];

    if (hasUpdateInput) {
      allocationListWithAsset.push(
        await this.updateAssetAllocationList(updateInput)
      );
    }
    if (insertInputList.length) {
      allocationListWithAsset.push(
        await this.insertAssetAllocationList(insertInputList)
      );
    }

    allocationListWithAsset.forEach((item) => {
      globalAllocationList = globalAllocationList.concat(
        item.assetAllocationList
      );
      globalStaticAssetResponseList = globalStaticAssetResponseList.concat(
        item.staticAssetResponseList
      );
      globalStaticAssetList = globalStaticAssetList.concat(item.assetList);
    });

    await this.orm.em.persist(globalStaticAssetList);
    await this.staticAssetAllocationRepo.persistAndFlush(globalAllocationList);

    return globalStaticAssetResponseList;
  }

  private async updateAssetAllocationList(
    updateInput: Record<string, StaticAssetAllocationInput>
  ): Promise<IAllocationListWithAsset> {
    const staticAssetResponseList: StaticAssetResponseItem[] = [];
    const assetList: Array<TextStaticAsset | S3StaticAsset> = [];
    const idList: string[] = Object.keys(updateInput);
    const assetAllocationList: StaticAssetAllocation[] =
      await this.staticAssetAllocationRepo.find(
        {
          id: { $in: idList },
        },
        {
          orderBy: {
            category: QueryOrder.ASC,
            order: QueryOrder.ASC,
          },
        }
      );

    if (idList.length !== assetAllocationList.length) {
      throw new NotFoundError('Some static asset allocations not found');
    }

    const assetMap: IStaticAssetMap = await this.getAssetMapFromAllocationList(
      assetAllocationList
    );

    assetAllocationList.forEach((assetAllocation) => {
      const {
        id,
        asset: assetInput,
        type,
        ...allocationData
      } = updateInput[assetAllocation.id];
      this.staticAssetAllocationRepo.assign(assetAllocation, allocationData);

      const assetTableId: string = assetAllocation.assetTableId;
      let asset: TextStaticAsset | S3StaticAsset;
      if (assetAllocation.assetTable === AssetTableName.TextStaticAsset) {
        asset = assetInput
          ? this.textStaticAssetRepo.assign(
              assetMap.textStaticAsset[assetTableId],
              assetInput
            )
          : assetMap.textStaticAsset[assetTableId];
      } else {
        asset = assetInput
          ? this.s3StaticAssetRepo.assign(
              assetMap.s3StaticAsset[assetTableId],
              {
                ...assetInput,
                s3Tag: assetInput.s3Tag
                  ? encodeURI(assetInput.s3Tag)
                  : assetMap.s3StaticAsset[assetTableId].s3Tag,
              }
            )
          : assetMap.s3StaticAsset[assetTableId];
      }

      staticAssetResponseList.push(
        new StaticAssetResponseItem(assetAllocation, asset)
      );
      assetList.push(asset);
    });

    return {
      staticAssetResponseList,
      assetAllocationList,
      assetList,
    };
  }

  private async insertAssetAllocationList(
    staticAssetInputList: StaticAssetAllocationInput[]
  ): Promise<IAllocationListWithAsset> {
    const staticAssetResponseList: StaticAssetResponseItem[] = [];
    const assetList: Array<TextStaticAsset | S3StaticAsset> = [];
    const assetAllocationList: StaticAssetAllocation[] = [];

    staticAssetInputList.forEach((allocationAssetInput) => {
      const {
        asset: assetInput,
        type,
        ...allocationData
      } = allocationAssetInput;
      const staticAllocation: StaticAssetAllocation =
        this.staticAssetAllocationRepo.create({
          ...allocationData,
          id: v4(),
          assetTable:
            type === TypeStaticAsset.Text
              ? AssetTableName.TextStaticAsset
              : AssetTableName.S3StaticAsset,
          assetTableId: v4(),
        });

      let staticAsset: S3StaticAsset | TextStaticAsset;
      if (allocationAssetInput.type === TypeStaticAsset.Text) {
        staticAsset = this.textStaticAssetRepo.create({
          ...assetInput,
          id: staticAllocation.assetTableId,
        });
      } else {
        staticAsset = this.s3StaticAssetRepo.create({
          ...assetInput,
          id: staticAllocation.assetTableId,
          type,
          s3Tag: encodeURI(assetInput.s3Tag),
        });
      }

      assetList.push(staticAsset);
      assetAllocationList.push(staticAllocation);
      staticAssetResponseList.push(
        new StaticAssetResponseItem(staticAllocation, staticAsset)
      );
    });

    return {
      staticAssetResponseList,
      assetAllocationList,
      assetList,
    };
  }

  private async getAssetMapFromAllocationList(
    assetAllocationList: StaticAssetAllocation[]
  ): Promise<IStaticAssetMap> {
    const s3StaticIdList: string[] = [];
    const textStaticIdList: string[] = [];

    assetAllocationList.forEach((assetAllocation) => {
      if (assetAllocation.assetTable === AssetTableName.S3StaticAsset) {
        s3StaticIdList.push(assetAllocation.assetTableId);
      } else if (
        assetAllocation.assetTable === AssetTableName.TextStaticAsset
      ) {
        textStaticIdList.push(assetAllocation.assetTableId);
      }
    });

    let s3StaticAssetList: S3StaticAsset[] = [];
    let textStaticAssetList: TextStaticAsset[] = [];
    const assetMap: IStaticAssetMap = {
      textStaticAsset: {},
      s3StaticAsset: {},
    };

    if (s3StaticIdList.length) {
      s3StaticAssetList = await this.s3StaticAssetRepo.find({
        id: { $in: s3StaticIdList },
      });
      assetMap.s3StaticAsset = s3StaticAssetList.reduce((accObj, asset) => {
        accObj[asset.id] = asset;
        return accObj;
      }, {});
    }

    if (textStaticIdList.length) {
      textStaticAssetList = await this.textStaticAssetRepo.find({
        id: { $in: textStaticIdList },
      });
      assetMap.textStaticAsset = textStaticAssetList.reduce((accObj, asset) => {
        accObj[asset.id] = asset;
        return accObj;
      }, {});
    }

    return assetMap;
  }

  private mapAssetResponse(
    assetAllocationList: StaticAssetAllocation[],
    assetMap: IStaticAssetMap
  ): StaticAssetResponseItem[] {
    const s3StaticAssetLength = Object.keys(assetMap.s3StaticAsset).length;
    const textStaticAssetLength = Object.keys(assetMap.textStaticAsset).length;
    if (
      assetAllocationList.length !==
      s3StaticAssetLength + textStaticAssetLength
    ) {
      throw new NotFoundError('Some static assets not found');
    }
    const staticAssetResponseList: StaticAssetResponseItem[] = [];
    assetAllocationList.forEach((assetAllocation) => {
      const staticAsset: S3StaticAsset | TextStaticAsset | undefined =
        assetAllocation.assetTable === AssetTableName.S3StaticAsset
          ? assetMap.s3StaticAsset[assetAllocation.assetTableId]
          : assetMap.textStaticAsset[assetAllocation.assetTableId];
      if (staticAsset) {
        staticAssetResponseList.push(
          new StaticAssetResponseItem(assetAllocation, staticAsset)
        );
      }
    });

    return staticAssetResponseList;
  }
}

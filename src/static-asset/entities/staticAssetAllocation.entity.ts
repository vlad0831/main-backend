/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Base } from '../../shared/base.entity';
import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { Roles } from '../../auth/types';
import { registerEnumType } from '@nestjs/graphql';

@Entity()
export class StaticAssetAllocation extends Base<StaticAssetAllocation, 'id'> {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Property({ columnType: 'text', unique: true })
  name: string;

  @Property({ columnType: 'text', default: '' })
  description: string = '';

  @Enum(() => AssetTableName)
  assetTable: AssetTableName;

  @Property({ type: 'uuid' })
  assetTableId: string;

  @Enum(() => StaticAssetCategory)
  category: StaticAssetCategory;

  @Property()
  order: number;

  @Enum({ items: () => Roles, array: true, default: [] })
  role: Roles[] = [];

  @Property({ default: [] })
  tag: string[] = [];
}

export enum AssetTableName {
  S3StaticAsset = 's3_static_asset',
  TextStaticAsset = 'text_static_asset',
}

export enum StaticAssetCategory {
  Splash = 'Splash',
}

registerEnumType(StaticAssetCategory, {
  name: 'StaticAssetCategory',
  description: 'supported static asset category',
});

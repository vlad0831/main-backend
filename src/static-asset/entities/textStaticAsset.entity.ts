/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Base } from '../../shared/base.entity';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AssetTableName } from './staticAssetAllocation.entity';

@Entity({ tableName: AssetTableName.TextStaticAsset })
export class TextStaticAsset extends Base<TextStaticAsset, 'id'> {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Property({ columnType: 'text', unique: true })
  name: string;

  @Property({ columnType: 'text', default: '' })
  description: string = '';

  @Property({ default: [] })
  tag: string[] = [];
}

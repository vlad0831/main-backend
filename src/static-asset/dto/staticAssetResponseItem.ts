import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  StaticAssetAllocation,
  StaticAssetCategory,
} from '../entities/staticAssetAllocation.entity';
import { S3StaticAsset } from '../entities/s3StaticAsset.entity';
import { TextStaticAsset } from '../entities/textStaticAsset.entity';
import { TypeStaticAsset } from '../interfaces/enums';

@ObjectType()
export class StaticAsset {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  tag: string[];

  @Field({ nullable: true })
  url: string;

  public constructor(staticAsset: S3StaticAsset | TextStaticAsset) {
    this.id = staticAsset.id;
    this.name = staticAsset.name;
    this.description = staticAsset.description;
    this.tag = staticAsset.tag;
    this.url = 'url' in staticAsset ? staticAsset.url : null;
  }
}

@ObjectType()
export class StaticAssetResponseItem {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => StaticAssetCategory)
  category: StaticAssetCategory;

  @Field(() => TypeStaticAsset)
  type: TypeStaticAsset;

  @Field(() => Int)
  order: number;

  @Field(() => [String])
  tag: string[];

  @Field(() => StaticAsset)
  asset: StaticAsset;

  public constructor(
    staticAssetAllocation: StaticAssetAllocation,
    staticAsset: S3StaticAsset | TextStaticAsset
  ) {
    this.id = staticAssetAllocation.id;
    this.name = staticAssetAllocation.name;
    this.description = staticAssetAllocation.description;
    this.category = staticAssetAllocation.category;
    this.type =
      'type' in staticAsset
        ? (staticAsset.type as unknown as TypeStaticAsset)
        : TypeStaticAsset.Text;

    this.order = staticAssetAllocation.order;
    this.tag = staticAssetAllocation.tag;
    this.asset = new StaticAsset(staticAsset);
  }
}

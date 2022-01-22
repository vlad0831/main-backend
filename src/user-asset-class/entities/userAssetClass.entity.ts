import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  LoadStrategy,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Base } from '../../shared/base.entity';
import { AssetClass } from '../../asset-class/entities/assetClass.entity';

@ObjectType()
@Entity()
export class UserAssetClass extends Base<UserAssetClass, 'id'> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field()
  @Property({ type: 'uuid' })
  userId: string;

  @Field(() => AssetClass)
  @ManyToOne({
    entity: () => AssetClass,
    strategy: LoadStrategy.JOINED,
  })
  assetClass: AssetClass;
}

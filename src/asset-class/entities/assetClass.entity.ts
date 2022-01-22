import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Base } from '../../shared/base.entity';

@ObjectType()
@Entity()
export class AssetClass extends Base<AssetClass, 'id'> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field()
  @Property({ length: 50 })
  name: string;

  @Field()
  @Property({ columnType: 'text' })
  description: string;
}

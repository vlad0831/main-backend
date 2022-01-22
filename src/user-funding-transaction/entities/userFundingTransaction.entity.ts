import { Base } from '../../shared/base.entity';
import {
  Entity,
  LoadStrategy,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { UserFundingMethod } from '../../user-funding-method/entities/userFundingMethod.entity';

@ObjectType()
@Entity()
export class UserFundingTransaction extends Base<UserFundingTransaction, 'id'> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field()
  @Property({ type: 'uuid' })
  userId: string;

  @Field()
  @Property({ columnType: 'text' })
  fromAccountTable: string;

  @Property({ type: 'uuid' })
  fromAccountId: string;

  @Field()
  @Property({ columnType: 'text' })
  toAccountTable: string;

  @Field()
  @Property({ type: 'uuid' })
  toAccountId: string;

  @Field(() => UserFundingMethod)
  @ManyToOne({
    entity: () => UserFundingMethod,
    strategy: LoadStrategy.JOINED,
    nullable: true,
  })
  fundingMethod: UserFundingMethod;

  @Field(() => Int)
  @Property({ columnType: 'int', default: 0 })
  statusNumber: number;

  @Field(() => Float)
  @Property({ columnType: 'decimal' })
  amount: number;

  @Field()
  @Property({ length: 3, default: 'USD' })
  currency: string;

  @Field(() => Date)
  @Property({ columnType: 'timestamptz' })
  executionDate: Date;

  @Field(() => GraphQLJSON)
  @Property({ type: 'json', default: '{}' })
  attribute: any;

  @Field()
  @Property({ columnType: 'text', nullable: true })
  note: string;
}

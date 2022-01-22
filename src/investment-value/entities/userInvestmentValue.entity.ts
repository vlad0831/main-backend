import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  LoadStrategy,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Base } from '../../shared/base.entity';
import { InvestmentValue } from './investmentValue.entity';

@ObjectType()
@Entity()
export class UserInvestmentValue extends Base<UserInvestmentValue, 'id'> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field()
  @Property({ type: 'uuid' })
  userId: string;

  @Field(() => InvestmentValue)
  @ManyToOne({
    entity: () => InvestmentValue,
    strategy: LoadStrategy.JOINED,
  })
  investmentValue: InvestmentValue;
}

/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Entity, Enum, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Base } from '../../shared/base.entity';
import { UserFundingMethod } from '../../user-funding-method/entities/userFundingMethod.entity';

@ObjectType()
@Entity()
export class UserRecurringFundingSetting extends Base<
  UserRecurringFundingSetting,
  'id'
> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @OneToOne({
    owner: true,
    entity: () => UserFundingMethod,
  })
  fundingMethod: UserFundingMethod;

  @Field(() => RecurringFundingFrequency)
  @Enum({ items: () => RecurringFundingFrequency })
  frequency: RecurringFundingFrequency;

  @Field(() => Int)
  @Property({ columnType: 'int', default: 1 })
  day: number = 1;

  @Field()
  @Property({ columnType: 'decimal' })
  amount: number;

  @Field()
  @Property({ length: 3, default: 'USD' })
  currency: string;

  @Field()
  @Property({ columnType: 'timestamptz' })
  nextExecutionDate: Date;
}

export enum RecurringFundingFrequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Biweekly = 'Biweekly',
  Monthly = 'Monthly',
}

registerEnumType(RecurringFundingFrequency, {
  name: 'RecurringFundingFrequency',
  description: 'supported recurring funding setting',
});

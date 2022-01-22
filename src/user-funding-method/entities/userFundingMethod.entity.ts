import {
  Entity,
  Enum,
  LoadStrategy,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Base } from '../../shared/base.entity';
import { UserRecurringFundingSetting } from '../../user-recurring-funding-setting/entities/userRecurringFundingSetting.entity';
import { UserPlaidLinkedItem } from '../../user-plaid-linked-item/entities/userPlaidLinkedItem.entity';

@ObjectType()
@Entity()
export class UserFundingMethod extends Base<UserFundingMethod, 'id'> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field()
  @Property({ type: 'uuid' })
  userId: string;

  @Field(() => FundingMethod)
  @Enum({ items: () => FundingMethod })
  method: FundingMethod;

  @Field(() => UserPlaidLinkedItem)
  @ManyToOne({
    entity: () => UserPlaidLinkedItem,
    strategy: LoadStrategy.JOINED,
  })
  plaidLinkedItem: UserPlaidLinkedItem;

  @Field(() => UserRecurringFundingSetting, { nullable: true })
  @OneToOne({
    entity: () => UserRecurringFundingSetting,
    mappedBy: (recurringSetting) => recurringSetting.fundingMethod,
    strategy: LoadStrategy.JOINED,
    owner: false,
  })
  recurringFundingSetting: UserRecurringFundingSetting;
}

export enum FundingMethod {
  OneTime = 'OneTime',
  Recurring = 'Recurring',
  RoundUp = 'RoundUp',
}

registerEnumType(FundingMethod, {
  name: 'FundingMethod',
  description: 'supported funding method types',
});

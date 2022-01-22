import {
  Entity,
  Enum,
  Filter,
  LoadStrategy,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserPersonaInquiry } from '../../user-persona-inquiry/entities/userPersonaInquiry.entity';
import { Base } from '../../shared/base.entity';
import { getStatusFilterQuery } from '../utils/getStatusFilterQuery';

@ObjectType()
@Entity()
@Filter({
  name: 'withKycStatus',
  cond: (args: { list: KycCheckStatus[] }, type) => {
    if (type !== 'read') {
      return {};
    }

    return getStatusFilterQuery(args.list);
  },
})
export class UserRequiredPersonaInquiry extends Base<
  UserRequiredPersonaInquiry,
  'id'
> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field()
  @Property({ type: 'uuid' })
  userId: string;

  @Field(() => UserPersonaInquiry)
  @OneToOne({
    entity: () => UserPersonaInquiry,
    strategy: LoadStrategy.JOINED,
    owner: true,
    eager: true,
  })
  inquiry: UserPersonaInquiry;

  @Field(() => KycPurpose)
  @Enum({ items: () => KycPurpose })
  // may want to index this column so keep this max length of 256 characters
  purpose: KycPurpose;

  @Field(() => KycCheckStatus)
  @Enum({ items: () => KycCheckStatus, persist: false })
  get kycCheckStatus() {
    const { status } = this.inquiry;
    if (status === KycCheckStatus.approved) {
      return KycCheckStatus.approved;
    }

    if (status === KycCheckStatus.declined) {
      return KycCheckStatus.declined;
    }

    return KycCheckStatus.pending;
  }
}

export enum KycPurpose {
  // add more kyc purpose here, such as Large_Fund_Kyc_Check
  Onboarding = 'Onboarding',
}

registerEnumType(KycPurpose, {
  name: 'KycPurpose',
  description: 'supported kyc check purposes',
});

export enum KycCheckStatus {
  approved = 'approved',
  declined = 'declined',
  pending = 'pending',
}

registerEnumType(KycCheckStatus, {
  name: 'KycCheckStatus',
  description: 'all possible Allio KYC check status',
});

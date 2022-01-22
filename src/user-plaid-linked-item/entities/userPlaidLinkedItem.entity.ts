import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { Base } from '../../shared/base.entity';

@ObjectType()
@Entity()
export class UserPlaidLinkedItem extends Base<UserPlaidLinkedItem, 'id'> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field()
  @Property({ type: 'uuid' })
  userId: string;

  @Property({ columnType: 'text' })
  accessToken: string;

  @Property({ columnType: 'text' })
  itemId: string;

  @Field()
  @Property({ columnType: 'text' })
  accountId: string;

  @Field()
  @Property({ columnType: 'text' })
  institutionId: string;

  @Field()
  @Property({ columnType: 'text' })
  institutionName: string;

  @Field()
  @Property({ columnType: 'text' })
  accountName: string;

  @Field()
  @Property({ columnType: 'text' })
  accountType: string;

  @Field()
  @Property({ columnType: 'text' })
  accountSubtype: string;

  @Field()
  @Property({ columnType: 'text' })
  accountMask: string;

  @Field(() => PlaidLinkedItemVerificationStatus, { nullable: true })
  @Enum({
    items: () => PlaidLinkedItemVerificationStatus,
    nullable: true,
  })
  verificationStatus?: PlaidLinkedItemVerificationStatus;

  @Property({ default: '' })
  driveWealthAccountId: string;
}

export enum PlaidLinkedItemVerificationStatus {
  AutomaticallyVerified = 'automatically_verified',
  PendingAutomaticVerification = 'pending_automatic_verification',
  PendingManualVerification = 'pending_manual_verification',
  ManuallyVerified = 'manually_verified',
  VerificationExpired = 'verification_expired',
  VerificationFailed = 'verification_failed',
}

registerEnumType(PlaidLinkedItemVerificationStatus, {
  name: 'PlaidLinkedItemVerificationStatus',
  description: 'supported plaid linked item verifications status check',
});

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Base } from '../../shared/base.entity';

export interface UserPersonaInquiryAttribute {
  note?: string;
  creator?: string;
  nextStepName?: string;
  tags?: string[];
  fields?: Record<string, any>;
  [key: string]: any;
}

@ObjectType()
@Entity()
export class UserPersonaInquiry extends Base<UserPersonaInquiry, 'id'> {
  @Field(() => ID)
  @PrimaryKey({ defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field()
  @Property({ type: 'uuid' })
  // in case some inquiry doesn't have any reference id associated with it
  // we simply don't store that inquiry
  userId: string;

  @Field()
  @Property({ nullable: false })
  status: string;

  @Field()
  @Property({ columnType: 'timestamptz', nullable: true })
  inquiryCreatedAt: Date;

  @Field()
  @Property({ columnType: 'timestamptz', nullable: true })
  inquiryStartedAt: Date;

  @Field()
  @Property({ columnType: 'timestamptz', nullable: true })
  inquiryCompletedAt: Date;

  @Field()
  @Property({ columnType: 'timestamptz', nullable: true })
  inquiryFailedAt: Date;

  @Field()
  @Property({ columnType: 'timestamptz', nullable: true })
  inquiryDecisionedAt: Date;

  @Field()
  @Property({ columnType: 'timestamptz', nullable: true })
  inquiryExpiredAt: Date;

  @Field()
  @Property({ columnType: 'timestamptz', nullable: true })
  inquiryRedactedAt: Date;

  @Field(() => GraphQLJSON)
  @Property({ type: 'json', default: '{}' })
  attribute: UserPersonaInquiryAttribute = {};
}

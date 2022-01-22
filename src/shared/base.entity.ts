/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Entity, BaseEntity, AnyEntity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ abstract: true })
export abstract class Base<
  T extends AnyEntity<T>,
  PK extends keyof T,
  P extends unknown = unknown
> extends BaseEntity<T, PK, P> {
  @Field()
  @Property({ default: true, name: 'active' })
  active: boolean = true;

  @Field()
  @Property({
    columnType: 'timestamptz',
    nullable: false,
    defaultRaw: 'CURRENT_TIMESTAMP',
  })
  createdAt: Date = new Date();

  @Field()
  @Property({
    columnType: 'timestamptz',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
    nullable: false,
  })
  updatedAt: Date = new Date();
}

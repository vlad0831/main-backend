import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  LoadStrategy,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { RiskLevel } from './riskLevel.entity';
import { Base } from '../../shared/base.entity';

@ObjectType()
@Entity()
export class UserRiskLevel extends Base<UserRiskLevel, 'id'> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field()
  @Property({ type: 'uuid' })
  userId: string;

  @Field(() => RiskLevel)
  @ManyToOne({
    entity: () => RiskLevel,
    strategy: LoadStrategy.JOINED,
  })
  riskLevel: RiskLevel;
}

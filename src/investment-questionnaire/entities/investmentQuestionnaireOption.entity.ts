import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Base } from '../../shared/base.entity';
import { InvestmentQuestionnaire } from './investmentQuestionnaire.entity';

@ObjectType()
@Entity()
export class InvestmentQuestionnaireOption extends Base<
  InvestmentQuestionnaireOption,
  'id'
> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @ManyToOne(() => InvestmentQuestionnaire)
  questionnaire: InvestmentQuestionnaire;

  @Field(() => Int)
  @Property()
  order!: number;

  @Field()
  @Property({ columnType: 'text', unique: true })
  option!: string;

  @Field()
  @Property({ columnType: 'text' })
  description!: string;
}

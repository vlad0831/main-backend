import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { InvestmentQuestionnaire } from '../../investment-questionnaire/entities/investmentQuestionnaire.entity';
import { InvestmentQuestionnaireOption } from '../../investment-questionnaire/entities/investmentQuestionnaireOption.entity';
import { Base } from '../../shared/base.entity';

@ObjectType()
@Entity()
export class UserInvestmentQuestionnaireAnswer extends Base<
  UserInvestmentQuestionnaireAnswer,
  'id'
> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Field()
  @Property({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => InvestmentQuestionnaire)
  questionnaire!: InvestmentQuestionnaire;

  @Field(() => String)
  @Property({ persist: false })
  get questionnaireId(): string {
    return this.questionnaire?.id;
  }

  @Field({ nullable: true })
  @Property({ columnType: 'text', nullable: true })
  answer?: string;

  @ManyToOne(() => InvestmentQuestionnaireOption, { nullable: true })
  selectedOption?: InvestmentQuestionnaireOption;

  @Field(() => String, { nullable: true })
  @Property({ persist: false, nullable: true })
  get selectedOptionId(): string {
    return this.selectedOption?.id;
  }
}

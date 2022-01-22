import { ArgsType, Field } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

@ArgsType()
export class SetUserQuestionnaireAnswerArgs {
  @IsUUID()
  @Field()
  questionnaireId: string = undefined;

  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  userId: string = undefined;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  @Field({ nullable: true })
  answer: string = undefined;

  @ArrayUnique()
  @IsUUID('all', { each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  selectedOptionIdList: string[] = undefined;
}

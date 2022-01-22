import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetAllQuestionnaireArgs {
  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  id?: string = undefined;
}

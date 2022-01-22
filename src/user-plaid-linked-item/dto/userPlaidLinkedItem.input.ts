import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UserPlaidLinkedItemInput {
  @IsString()
  @Field()
  plaidPublicToken: string = undefined;

  @IsString()
  @Field()
  plaidInstitutionId: string = undefined;

  @IsString()
  @Field()
  plaidAccountId: string = undefined;
}

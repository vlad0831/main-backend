import { IsString, ValidateIf } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserPlaidIdentifierInput {
  @ValidateIf((o) => !o.userPlaidLinkedItemId)
  @IsString()
  @Field({ nullable: true })
  accountId: string = undefined;

  @ValidateIf((o) => !o.accountId)
  @IsString()
  @Field({ nullable: true })
  userPlaidLinkedItemId: string = undefined;
}

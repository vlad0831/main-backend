import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetUserFundingTransactionArgs {
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  userId?: string = undefined;
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransferMoneyResponse {
  @Field({ nullable: true })
  userId?: string;

  @Field(() => Boolean)
  isSuccess: boolean;

  @Field(() => String, { nullable: true })
  message: string;
}

import { Enum, Property } from '@mikro-orm/core';
import { ArgsType, Field, Float } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class TransferMoneyArgs {
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  userId?: string = undefined;

  @IsNumber()
  @Field(() => Float)
  amount: number = undefined;

  @Field()
  @Property({ type: 'uuid' })
  fromAccountId: string = undefined;

  @Field()
  @Enum(() => TransferMoneyType)
  transferType: TransferMoneyType = undefined;
}

export enum TransferMoneyType {
  Deposit = 'Deposit',
  Withdrawal = 'Withdrawal',
}

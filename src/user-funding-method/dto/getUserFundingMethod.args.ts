import { ArgsType, Field } from '@nestjs/graphql';
import {
  ArrayMinSize,
  ArrayUnique,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { FundingMethod } from '../entities/userFundingMethod.entity';

@ArgsType()
export class GetUserFundingMethodArgs {
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  userId?: string = undefined;

  @IsOptional()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(FundingMethod, { each: true })
  @Field(() => [FundingMethod], { nullable: true })
  methodList: FundingMethod[] = undefined;
}

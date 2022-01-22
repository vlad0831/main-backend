import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { SetFundingMethodInput } from './setFundingMethod.input';

@ArgsType()
export class SetUserFundingMethodArgs {
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  userId?: string = undefined;

  @ArrayMinSize(1)
  @IsArray()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => SetFundingMethodInput)
  @Field(() => [SetFundingMethodInput])
  fundingMethodList: SetFundingMethodInput[] = undefined;
}

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
import { DeleteFundingMethodInput } from './deleteFundingMethod.input';

@ArgsType()
export class DeleteUserFundingMethodArgs {
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  userId?: string = undefined;

  @ArrayMinSize(1)
  @IsArray()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => DeleteFundingMethodInput)
  @Field(() => [DeleteFundingMethodInput])
  fundingMethodList: DeleteFundingMethodInput[] = undefined;
}

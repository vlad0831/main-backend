/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUppercase,
  Length,
  Max,
  Min,
} from 'class-validator';
import { RecurringFundingFrequency } from '../entities/userRecurringFundingSetting.entity';

@InputType()
export class RecurringFundingSettingInput {
  @IsEnum(RecurringFundingFrequency)
  @Field(() => RecurringFundingFrequency)
  frequency: RecurringFundingFrequency = undefined;

  @IsNumber()
  @Field(() => Float)
  amount: number = undefined;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  day: number = 1;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  @IsUppercase()
  @Field({ nullable: true })
  currency: string = undefined;
}

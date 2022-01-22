import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';
import { GetUserPropertiesArgs } from '../../shared/dto/getUserProperties.args';

@ArgsType()
export class GetUserInvestmentPerformanceArgs extends GetUserPropertiesArgs {
  @IsOptional()
  @Min(1)
  @IsInt()
  @Field(() => Int, { nullable: true })
  monthPeriod: number = undefined;

  @IsOptional()
  @Min(1)
  @IsInt()
  @Field(() => Int, { nullable: true })
  weekPeriod: number = undefined;

  @IsOptional()
  @Min(1)
  @IsInt()
  @Field(() => Int, { nullable: true })
  dayPeriod: number = undefined;
}

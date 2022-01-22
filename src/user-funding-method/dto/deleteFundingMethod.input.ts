import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDefined, IsEnum, IsUUID, ValidateIf } from 'class-validator';
import { FundingMethod } from '../entities/userFundingMethod.entity';

@InputType()
export class DeleteFundingMethodInput {
  @ValidateIf((o) => !o.method)
  @IsUUID()
  @IsDefined()
  @Field(() => ID, { nullable: true })
  userFundingMethodId?: string = undefined;

  @IsEnum(FundingMethod)
  @IsDefined()
  @ValidateIf((o) => !o.userFundingMethodId)
  @Field(() => FundingMethod, { nullable: true })
  method?: FundingMethod = undefined;
}

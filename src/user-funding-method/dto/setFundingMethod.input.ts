import { Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { UserPlaidLinkedItemInput } from '../../user-plaid-linked-item/dto/userPlaidLinkedItem.input';
import { RecurringFundingSettingInput } from '../../user-recurring-funding-setting/dto/recurringFundingSetting.input';
import { FundingMethod } from '../entities/userFundingMethod.entity';

@InputType()
export class SetFundingMethodInput {
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

  @ValidateIf((o) => !o.plaidLinkedItem)
  @IsUUID()
  @IsDefined()
  @Field(() => ID, { nullable: true })
  userPlaidLinkedItemId?: string = undefined;

  @ValidateIf((o) => !o.userPlaidLinkedItemId)
  @IsDefined()
  @ValidateNested()
  @Type(() => UserPlaidLinkedItemInput)
  @Field(() => UserPlaidLinkedItemInput, { nullable: true })
  plaidLinkedItem?: UserPlaidLinkedItemInput = undefined;

  @ValidateIf((o) => o.method === FundingMethod.Recurring)
  @IsDefined()
  @ValidateNested()
  @Type(() => RecurringFundingSettingInput)
  @Field(() => RecurringFundingSettingInput, { nullable: true })
  recurringFundingSetting?: RecurringFundingSettingInput = undefined;
}

import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { GetUserPropertiesArgs } from '../../shared/dto/getUserProperties.args';
import { UserRequiredPersonaInquiryInput } from './userRequiredPersonaInquiry.input';

@ArgsType()
export class SetUserRequiredPersonaInquiryListArgs extends GetUserPropertiesArgs {
  @ArrayMinSize(1)
  @IsArray()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => UserRequiredPersonaInquiryInput)
  @Field(() => [UserRequiredPersonaInquiryInput])
  requiredInquiryList: UserRequiredPersonaInquiryInput[] = undefined;
}

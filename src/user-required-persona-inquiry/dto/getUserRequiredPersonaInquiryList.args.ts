import { ArgsType, Field } from '@nestjs/graphql';
import { ArrayUnique, IsArray, IsEnum, IsOptional } from 'class-validator';
import { GetUserPropertiesArgs } from '../../shared/dto/getUserProperties.args';
import {
  KycCheckStatus,
  KycPurpose,
} from '../entities/userRequiredPersonaInquiry.entity';

@ArgsType()
export class GetUserRequiredPersonaInquiryListArgs extends GetUserPropertiesArgs {
  @IsOptional()
  @IsArray()
  @IsEnum(KycPurpose, { each: true })
  @ArrayUnique()
  @Field(() => [KycPurpose], { nullable: true })
  purposeList: KycPurpose[] = undefined;

  @IsOptional()
  @IsArray()
  @IsEnum(KycCheckStatus, { each: true })
  @ArrayUnique()
  @Field(() => [KycCheckStatus], { nullable: true })
  kycCheckStatusList: KycCheckStatus[] = undefined;
}

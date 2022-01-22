import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { KycPurpose } from '../entities/userRequiredPersonaInquiry.entity';

@InputType()
export class UserRequiredPersonaInquiryInput {
  @IsString()
  @Field()
  inquiryId: string = undefined;

  @IsString()
  @Field(() => KycPurpose)
  purpose: KycPurpose = undefined;
}

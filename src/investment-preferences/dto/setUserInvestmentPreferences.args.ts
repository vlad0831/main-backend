import { GetUserPropertiesArgs } from '../../shared/dto/getUserProperties.args';
import { ArgsType, Field } from '@nestjs/graphql';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsUUID,
} from 'class-validator';

@ArgsType()
export class SetUserInvestmentPreferencesArgs extends GetUserPropertiesArgs {
  @IsUUID()
  @IsOptional()
  @Field({ nullable: true })
  riskLevelId: string = undefined;

  @ArrayUnique()
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  investmentValueIdList: string[] = undefined;

  @ArrayMinSize(5)
  @ArrayUnique()
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  assetClassIdList: string[] = undefined;
}

import { ArgsType, Field } from '@nestjs/graphql';
import { GetUserPropertiesArgs } from '../../shared/dto/getUserProperties.args';
import { ArrayUnique, IsArray, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class GetUserRecommendedPortfolioAssetsArgs extends GetUserPropertiesArgs {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  investmentValueIdList: string[] = undefined;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  assetClassIdList: string[] = undefined;
}

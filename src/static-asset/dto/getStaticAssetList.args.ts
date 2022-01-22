import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { StaticAssetCategory } from '../entities/staticAssetAllocation.entity';
import {
  ArrayUnique,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TypeStaticAsset } from '../interfaces/enums';

@InputType()
export class CategoryFilterItem {
  @IsEnum(StaticAssetCategory)
  @Field(() => StaticAssetCategory)
  category: StaticAssetCategory = undefined;

  @ArrayUnique()
  @IsInt({ each: true })
  @IsOptional()
  @Field(() => [Int], { nullable: true })
  orderList: number[] = undefined;
}

@ArgsType()
export class GetStaticAssetListArgs {
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CategoryFilterItem)
  @Field(() => [CategoryFilterItem], { nullable: true })
  categoryList: CategoryFilterItem[] = undefined;

  @ArrayUnique()
  @IsEnum(TypeStaticAsset, { each: true })
  @IsOptional()
  @Field(() => [TypeStaticAsset], { nullable: true })
  typeList: TypeStaticAsset[] = undefined;

  @ArrayUnique()
  @IsString({ each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  nameList: string[] = undefined;
}

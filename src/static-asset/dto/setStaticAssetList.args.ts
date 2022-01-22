import { ArgsType, Field, ID, InputType, Int } from '@nestjs/graphql';
import { StaticAssetCategory } from '../entities/staticAssetAllocation.entity';
import { TypeStaticAsset } from '../interfaces/enums';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Roles } from '../../auth/types';

@InputType()
export class StaticAssetInput {
  @IsString()
  @Length(1, 255)
  @Field()
  name: string = undefined;

  @IsString()
  @Length(1, 255)
  @Field()
  description: string = undefined;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  @Field({ nullable: true })
  s3Bucket: string = undefined;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  @Field({ nullable: true })
  s3Tag: string = undefined;

  @IsString({ each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  tag: string[] = undefined;
}

@InputType()
export class StaticAssetAllocationInput {
  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  id: string = undefined;

  @IsString()
  @Length(1, 255)
  @ValidateIf((o) => !o.id || o.name !== undefined)
  @Field({ nullable: true })
  name: string = undefined;

  @IsString()
  @Length(1, 255)
  @ValidateIf((o) => !o.id || o.description !== undefined)
  @Field({ nullable: true })
  description: string = undefined;

  @IsEnum(StaticAssetCategory)
  @ValidateIf((o) => !o.id || o.category !== undefined)
  @Field(() => StaticAssetCategory, { nullable: true })
  category: StaticAssetCategory = undefined;

  @IsEnum(TypeStaticAsset)
  @ValidateIf((o) => !o.id || o.type !== undefined)
  @Field(() => TypeStaticAsset, { nullable: true })
  type: TypeStaticAsset = undefined;

  @IsInt()
  @Min(1)
  @ValidateIf((o) => !o.id || o.order !== undefined)
  @Field(() => Int, { nullable: true })
  order: number = undefined;

  @IsString({ each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  tag: string[] = undefined;

  @IsEnum(Roles, { each: true })
  @IsOptional()
  @Field(() => [Roles], { nullable: true })
  role: Roles[] = undefined;

  @ValidateNested()
  @IsObject()
  @Type(() => StaticAssetInput)
  @ValidateIf((o) => !o.id || o.asset !== undefined)
  @Field(() => StaticAssetInput, { nullable: true })
  asset: StaticAssetInput = undefined;
}

@ArgsType()
export class SetStaticAssetListArgs {
  @ArrayUnique((o) => o.name)
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StaticAssetAllocationInput)
  @Field(() => [StaticAssetAllocationInput])
  staticAssetInputList: StaticAssetAllocationInput[] = undefined;
}

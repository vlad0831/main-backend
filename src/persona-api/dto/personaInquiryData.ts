import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  PersonaAttributesDto,
  PersonaEntityDataDto,
  PersonaEntityDto,
  PersonaIncludedDto,
  PersonaRelationshipArrayDto,
  PersonaRelationshipDto,
} from './personaEntityData';

export class PersonaInquiryRelationshipsDto {
  @ValidateNested()
  @Type(() => PersonaRelationshipDto)
  @ApiProperty({ type: PersonaRelationshipDto })
  account: PersonaRelationshipDto;

  @ValidateNested()
  @Type(() => PersonaRelationshipDto)
  @ApiProperty({ type: PersonaRelationshipDto })
  template: PersonaRelationshipDto;

  @IsArray()
  @ValidateNested({ each: true })
  @IsString({ each: true })
  @ApiProperty()
  reports: string[];

  @ValidateNested()
  @Type(() => PersonaRelationshipArrayDto)
  @ApiProperty({ type: PersonaRelationshipArrayDto })
  verifications: PersonaRelationshipArrayDto;

  @ValidateNested()
  @Type(() => PersonaRelationshipArrayDto)
  @ApiProperty({ type: PersonaRelationshipArrayDto })
  sessions: PersonaRelationshipArrayDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => PersonaRelationshipArrayDto)
  @ApiProperty({ type: PersonaRelationshipArrayDto, nullable: true })
  documents?: PersonaRelationshipArrayDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => PersonaRelationshipArrayDto)
  @ApiProperty({ type: PersonaRelationshipArrayDto, nullable: true })
  selfies?: PersonaRelationshipArrayDto;
}

export class PersonaInquiryAttributesDto extends PersonaAttributesDto {
  @IsString()
  @ApiProperty()
  status: string;

  @IsUUID()
  @ApiProperty()
  referenceId: string;

  @IsString()
  @ApiProperty()
  subject: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  note?: string | null;

  @IsArray()
  @ApiProperty()
  tags: any[];

  @IsString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  creator?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  reviewerComment?: string | null;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  startedAt?: string | null;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  completedAt?: string | null;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  failedAt?: string | null;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  decisionedAt?: string | null;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  expiredAt?: string | null;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  redactedAt?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  nextStepName?: string | null;

  @ApiProperty()
  fields: any = {};
}

export class PersonaInquiryDataDto extends PersonaEntityDataDto {
  @ValidateNested()
  @Type(() => PersonaInquiryAttributesDto)
  @ApiProperty({ type: PersonaInquiryAttributesDto })
  attributes: PersonaInquiryAttributesDto;

  @ValidateNested()
  @Type(() => PersonaInquiryRelationshipsDto)
  @ApiProperty({ type: PersonaInquiryRelationshipsDto })
  relationships: PersonaInquiryRelationshipsDto;
}
export class PersonaInquiryIncludedAttributes extends PersonaAttributesDto {
  @IsString()
  @ApiProperty()
  status: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  startedAt?: string | null;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  completedAt?: string | null;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  failedAt?: string | null;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  decisionedAt?: string | null;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  expiredAt?: string | null;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: () => [String, null], nullable: true })
  redactedAt?: string | null;

  @IsString()
  @ApiProperty()
  @IsOptional()
  nameFirst?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  nameMiddle?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  nameLast?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  addressStreet1?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  addressStreet2?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  addressCity?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  addressSubdivision?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  addressPostalCode?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  birthdate?: string;
}

export class PersonaInquiryIncludedDto extends PersonaIncludedDto {
  @ValidateNested()
  @Type(() => PersonaInquiryIncludedAttributes)
  @ApiProperty({ type: PersonaInquiryIncludedAttributes })
  attributes: PersonaInquiryIncludedAttributes;
}

export class PersonaInquiryDto extends PersonaEntityDto {
  @ValidateNested()
  @Type(() => PersonaInquiryDataDto)
  @ApiProperty({ type: PersonaInquiryDataDto })
  data: PersonaInquiryDataDto;

  @ValidateNested()
  @Type(() => PersonaInquiryIncludedDto)
  @ApiProperty({ type: PersonaInquiryIncludedDto })
  included: PersonaInquiryIncludedDto;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class PersonaRelationshipDataDto {
  @IsString()
  @ApiProperty({ type: () => [String, null] })
  type: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  @ApiProperty({ nullable: true })
  id?: string;
}

export class PersonaRelationshipDto {
  @ValidateNested()
  @Type(() => PersonaRelationshipDataDto)
  @ApiProperty({ type: PersonaRelationshipDataDto })
  data: PersonaRelationshipDataDto;
}

export class PersonaRelationshipArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonaRelationshipDataDto)
  @ApiProperty({ type: [PersonaRelationshipDataDto] })
  data: PersonaRelationshipDataDto[];
}

export class PersonaRelationshipsDto {
  [key: string]: any;
}

export class PersonaAttributesDto {
  @IsDateString()
  @IsOptional()
  @ApiProperty()
  createdAt?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  updatedAt?: string;
}

export class PersonaEntityDataDto {
  @IsString()
  @ApiProperty()
  type: string;

  @IsString()
  @MaxLength(256)
  @ApiProperty()
  id: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => PersonaAttributesDto)
  @ApiProperty({ type: PersonaAttributesDto })
  attributes?: PersonaAttributesDto;
}

export class PersonaIncludedDto extends PersonaEntityDataDto {}

export class PersonaEntityDto {
  @ValidateNested()
  @Type(() => PersonaEntityDataDto)
  @ApiProperty({ type: PersonaEntityDataDto })
  data: PersonaEntityDataDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => PersonaIncludedDto)
  @ApiProperty({ type: PersonaIncludedDto, nullable: true })
  included?: PersonaIncludedDto;
}

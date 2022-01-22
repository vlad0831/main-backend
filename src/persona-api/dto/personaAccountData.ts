import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  PersonaAttributesDto,
  PersonaEntityDataDto,
  PersonaEntityDto,
} from './personaEntityData';

export class PersonaAccountAttributesDto extends PersonaAttributesDto {
  @IsUUID()
  @ApiProperty()
  referenceId: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  createdAt?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  updatedAt?: string;
}

export class PersonaAccountDataDto extends PersonaEntityDataDto {
  @ValidateNested()
  @Type(() => PersonaAccountAttributesDto)
  @ApiProperty({ type: PersonaAccountAttributesDto })
  attributes: PersonaAccountAttributesDto;
}

export class PersonaAccountDto extends PersonaEntityDto {}

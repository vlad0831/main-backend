import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  PersonaAttributesDto,
  PersonaEntityDataDto,
  PersonaEntityDto,
} from '../../persona-api/dto/personaEntityData';

export class PersonaWebhookEventAttributesDto extends PersonaAttributesDto {
  @IsString()
  @MaxLength(256)
  @ApiProperty()
  name: string;

  @ValidateNested()
  @Type(() => PersonaEntityDto)
  @ApiProperty({ type: PersonaEntityDto })
  payload: PersonaEntityDto;

  @IsDateString()
  @ApiProperty()
  createdAt: string;
}

export class PersonaWebhookEventDataDto extends PersonaEntityDataDto {
  @IsString()
  @ApiProperty()
  type: 'event';

  @IsString()
  @MaxLength(256)
  @ApiProperty()
  id: string;

  @ValidateNested()
  @Type(() => PersonaWebhookEventAttributesDto)
  @ApiProperty({ type: PersonaWebhookEventAttributesDto })
  attributes: PersonaWebhookEventAttributesDto;
}

export class PersonaWebhookEventDto {
  @ValidateNested()
  @Type(() => PersonaWebhookEventDataDto)
  @ApiProperty({ type: PersonaWebhookEventDataDto })
  data: PersonaWebhookEventDataDto;
}

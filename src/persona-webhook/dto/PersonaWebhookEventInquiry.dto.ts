import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PersonaInquiryDto } from '../../persona-api/dto/personaInquiryData';
import {
  PersonaWebhookEventAttributesDto,
  PersonaWebhookEventDataDto,
  PersonaWebhookEventDto,
} from './personaWebhookEvent.dto';

export class PersonaWebhookEventInquiryAttributesDto extends PersonaWebhookEventAttributesDto {
  @ValidateNested()
  @Type(() => PersonaInquiryDto)
  @ApiProperty({ type: PersonaInquiryDto })
  payload: PersonaInquiryDto;
}

export class PersonaWebhookEventInquiryDataDto extends PersonaWebhookEventDataDto {
  @ValidateNested()
  @Type(() => PersonaWebhookEventInquiryAttributesDto)
  @ApiProperty({ type: PersonaWebhookEventInquiryAttributesDto })
  attributes: PersonaWebhookEventInquiryAttributesDto;
}

export class PersonaWebhookEventInquiryDto extends PersonaWebhookEventDto {
  @ValidateNested()
  @Type(() => PersonaWebhookEventInquiryDataDto)
  @ApiProperty({ type: PersonaWebhookEventInquiryDataDto })
  data: PersonaWebhookEventInquiryDataDto;
}

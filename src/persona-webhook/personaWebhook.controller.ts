import { Body, Logger, Post, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { PersonaSignatureGuard } from './personaSignature.guards';
import { BooleanResultResponse } from 'src/shared/dto/booleanResult.response';
import { PersonaWebhookService } from './personaWebhook.service';
import { PersonaWebhookEventInquiryDto } from './dto/PersonaWebhookEventInquiry.dto';

@UseGuards(PersonaSignatureGuard)
@ApiTags('PersonaWebhook')
@Controller('webhook/persona')
export class PersonaWebhookController {
  private readonly logger: Logger;
  constructor(private readonly personaWebhookService: PersonaWebhookService) {
    this.logger = new Logger(PersonaWebhookController.name);
  }

  @ApiHeader({ name: 'persona-signature' })
  @Post('inquiry-approved')
  async inquiryApprovedWebhook(
    @Body() body: PersonaWebhookEventInquiryDto
  ): Promise<BooleanResultResponse> {
    try {
      await this.personaWebhookService.handlePersonaWebhookInquiryEventReceivedEvent(
        body
      );
      return { result: true };
    } catch {
      return { result: false };
    }
  }

  @ApiHeader({ name: 'persona-signature' })
  @Post('inquiry-marked-for-review')
  async inquiryMarkedForReviewWebhook(
    @Body() body: PersonaWebhookEventInquiryDto
  ) {
    try {
      await this.personaWebhookService.handlePersonaWebhookInquiryEventReceivedEvent(
        body
      );
      return { result: true };
    } catch {
      return { result: false };
    }
  }
}

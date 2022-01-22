import { Module } from '@nestjs/common';
import { PersonaWebhookController } from './personaWebhook.controller';
import { PersonaWebhookService } from './personaWebhook.service';
import { PersonaSignatureGuard } from './personaSignature.guards';
import { PersonaWebhookEventModule } from '../persona-webhook-event/personaWebhookEvent.module';
import { UserPersonaInquiryModule } from '../user-persona-inquiry/userPersonaInquiry.module';

@Module({
  imports: [PersonaWebhookEventModule, UserPersonaInquiryModule],
  providers: [PersonaSignatureGuard, PersonaWebhookService],
  controllers: [PersonaWebhookController],
  exports: [PersonaWebhookService],
})
export class PersonaWebhookModule {}

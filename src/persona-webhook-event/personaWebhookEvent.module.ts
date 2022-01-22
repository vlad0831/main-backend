import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PersonaWebhookEvent } from './entities/personaWebhookEvent.entity';
import { PersonaWebhookEventService } from './personaWebhookEvent.service';

@Module({
  imports: [MikroOrmModule.forFeature([PersonaWebhookEvent])],
  providers: [PersonaWebhookEventService],
  exports: [PersonaWebhookEventService],
})
export class PersonaWebhookEventModule {}

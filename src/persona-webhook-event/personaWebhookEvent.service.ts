import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { PersonaWebhookEvent } from './entities/personaWebhookEvent.entity';
import { BaseService } from '../shared/base.service';

@Injectable()
export class PersonaWebhookEventService extends BaseService<PersonaWebhookEvent> {
  protected logger: Logger;
  public constructor(
    @InjectRepository(PersonaWebhookEvent)
    private readonly personaWebhookEventRepo: EntityRepository<PersonaWebhookEvent>
  ) {
    super(personaWebhookEventRepo);
    this.logger = new Logger(PersonaWebhookEventService.name);
  }
}

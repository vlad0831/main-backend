import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { UserPersonaInquiry } from '../user-persona-inquiry/entities/userPersonaInquiry.entity';
import { PersonaWebhookEventService } from '../persona-webhook-event/personaWebhookEvent.service';
import { UserPersonaInquiryService } from '../user-persona-inquiry/userPersonaInquiry.service';
import { PersonaWebhookEventInquiryDto } from './dto/PersonaWebhookEventInquiry.dto';

@Injectable()
export class PersonaWebhookService {
  private readonly logger: Logger;
  private readonly personaWebhookSecretObj: Record<string, string>;
  private readonly personaWebhookSourceIpList: string[];

  constructor(
    private readonly configService: ConfigService,
    private readonly personaWebhookEventService: PersonaWebhookEventService,
    private readonly userPersonaInquiryService: UserPersonaInquiryService,
    private readonly orm: MikroORM<PostgreSqlDriver>
  ) {
    this.personaWebhookSecretObj = {};
    this.personaWebhookSecretObj['inquiry-approved'] = this.configService.get(
      'PERSONA_WEBHOOK_INQUIRY_APPROVED_SECRET'
    );
    this.personaWebhookSecretObj['inquiry-marked-for-review'] =
      this.configService.get(
        'PERSONA_WEBHOOK_INQUIRY_MARKED_FOR_REVIEW_SECRET'
      );
    this.personaWebhookSourceIpList = this.configService
      .get('PERSONA_WEBHOOK_SOURCE_IP_LIST', '')
      .split(',');

    this.logger = new Logger(PersonaWebhookService.name);
  }

  validatePersonaWebhookSignature({
    personaSignature,
    path,
    rawBody,
  }: {
    personaSignature: string;
    path: string;
    rawBody: string;
  }): boolean {
    const sigParams = personaSignature
      .split(',')
      .reduce<Record<string, string>>((accObj, pair) => {
        const [key, value] = pair.split('=');
        return {
          ...accObj,
          [key]: value,
        };
      }, {});

    if (sigParams.t && sigParams.v1) {
      const hmac = crypto
        .createHmac('sha256', this.personaWebhookSecretObj[path])
        .update(`${sigParams.t}.${rawBody}`)
        .digest('hex');

      if (
        crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(sigParams.v1))
      ) {
        return true;
      }
    }
    return false;
  }

  validatePersonaWebhookIpSource(ip: string): boolean {
    return this.personaWebhookSourceIpList.includes(ip);
  }

  public async handlePersonaWebhookInquiryEventReceivedEvent(
    payload: PersonaWebhookEventInquiryDto
  ): Promise<void> {
    const eventReceivedAt = new Date();
    const eventId = payload.data.id;

    const existingEvent = await this.personaWebhookEventService
      .getById(eventId)
      .catch(() => {});

    if (existingEvent) {
      return;
    }

    const inquiryData = payload.data.attributes.payload.data;

    const newInquiryEvent = this.personaWebhookEventService.create({
      id: eventId,
      event: payload.data.attributes.name,
      // subject will always be 'inquiry' for this type of event
      subject: inquiryData.type,
      subjectId: inquiryData.id,
      createdAt: new Date(payload.data.attributes.createdAt),
      updatedAt: eventReceivedAt,
    });

    this.personaWebhookEventService.persist(newInquiryEvent);

    let newInquiry: UserPersonaInquiry;
    try {
      newInquiry =
        this.userPersonaInquiryService.createEntityFromInquiryData(inquiryData);
    } catch (err) {
      this.logger.error(`Persona Webhook Event ${eventId}: ${err}`);
      this.logger.log(`Not persisting inquiry ${inquiryData.id}`);
    }

    if (newInquiry) {
      await this.userPersonaInquiryService.upsert({
        data: newInquiry,
        where: { id: newInquiry.id },
        flush: false,
      });
    }

    await this.orm.em.flush();
  }
}

import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import {
  UserPersonaInquiry,
  UserPersonaInquiryAttribute,
} from './entities/userPersonaInquiry.entity';
import { BadRequestError } from '../shared/errors';
import { isUUID } from 'class-validator';
import { PersonaInquiryDataDto } from '../persona-api/dto/personaInquiryData';

@Injectable()
export class UserPersonaInquiryService extends BaseService<UserPersonaInquiry> {
  protected logger: Logger;
  public constructor(
    @InjectRepository(UserPersonaInquiry)
    private readonly userPersonaInquiryRepo: EntityRepository<UserPersonaInquiry>
  ) {
    super(userPersonaInquiryRepo);
    this.logger = new Logger(UserPersonaInquiryService.name);
  }

  createEntityFromInquiryData(inquiryData: PersonaInquiryDataDto) {
    if (
      !inquiryData.attributes.referenceId ||
      !isUUID(inquiryData.attributes.referenceId)
    ) {
      throw new BadRequestError(
        'No valid referenceId found in the inquiry data'
      );
    }

    const inquiry = new UserPersonaInquiry();
    inquiry.id = inquiryData.id;
    inquiry.userId = inquiryData.attributes.referenceId;
    inquiry.status = inquiryData.attributes.status;
    inquiry.inquiryCreatedAt = inquiryData.attributes.createdAt
      ? new Date(inquiryData.attributes.createdAt)
      : undefined;
    inquiry.inquiryStartedAt = inquiryData.attributes.startedAt
      ? new Date(inquiryData.attributes.startedAt)
      : undefined;
    inquiry.inquiryCompletedAt = inquiryData.attributes.completedAt
      ? new Date(inquiryData.attributes.completedAt)
      : undefined;
    inquiry.inquiryFailedAt = inquiryData.attributes.failedAt
      ? new Date(inquiryData.attributes.failedAt)
      : undefined;
    inquiry.inquiryDecisionedAt = inquiryData.attributes.decisionedAt
      ? new Date(inquiryData.attributes.decisionedAt)
      : undefined;
    inquiry.inquiryExpiredAt = inquiryData.attributes.expiredAt
      ? new Date(inquiryData.attributes.expiredAt)
      : undefined;
    inquiry.inquiryRedactedAt = inquiryData.attributes.redactedAt
      ? new Date(inquiryData.attributes.redactedAt)
      : undefined;

    inquiry.attribute = <UserPersonaInquiryAttribute>{};
    ['note', 'creator', 'nextStepName'].forEach((key) => {
      if (inquiryData.attributes[key]) {
        inquiry.attribute[key] = inquiryData.attributes[key];
      }
    });
    if (Object.keys(inquiryData.attributes.fields).length) {
      inquiry.attribute.fields = inquiryData.attributes.fields;
    }
    if (inquiryData.attributes.tags.length) {
      inquiry.attribute.tags = inquiryData.attributes.tags;
    }

    return inquiry;
  }

  async getOrCreateFromInquiryIdList({
    userId,
    inquiryIdList,
    flush = true,
  }: {
    userId: string;
    inquiryIdList: string[];
    flush?: boolean;
  }): Promise<Record<string, UserPersonaInquiry>> {
    const existingInquiryList = await this.find({ id: { $in: inquiryIdList } });
    const result = existingInquiryList.reduce<
      Record<string, UserPersonaInquiry>
    >(
      (accuObj, inquiry) => ({
        ...accuObj,
        [inquiry.id]: inquiry,
      }),
      {}
    );

    inquiryIdList.forEach((inquiryId) => {
      if (result[inquiryId]) {
        return;
      }

      const inquiry = this.create({ id: inquiryId, userId, status: '' });
      this.persist(inquiry);
      result[inquiryId] = inquiry;
    });

    if (flush) {
      await this.flush();
    }
    return result;
  }
}

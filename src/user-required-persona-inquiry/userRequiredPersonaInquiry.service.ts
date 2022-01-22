import {
  EntityRepository,
  EntityManager,
  PostgreSqlDriver,
} from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { UserRequiredPersonaInquiry } from './entities/userRequiredPersonaInquiry.entity';
import { BadRequestError, NotFoundError } from '../shared/errors';
import { EntityData, FilterQuery, MikroORM } from '@mikro-orm/core';
import { GetUserRequiredPersonaInquiryListArgs } from './dto/getUserRequiredPersonaInquiryList.args';
import { SetUserRequiredPersonaInquiryListArgs } from './dto/setUserReqruiedPersonaInquiryList.args';
import { UserPersonaInquiryService } from '../user-persona-inquiry/userPersonaInquiry.service';

@Injectable()
export class UserRequiredPersonaInquiryService extends BaseService<UserRequiredPersonaInquiry> {
  protected logger: Logger;
  private readonly em: EntityManager;
  public constructor(
    @InjectRepository(UserRequiredPersonaInquiry)
    private readonly userRequiredPersonaInquiryRepo: EntityRepository<UserRequiredPersonaInquiry>,
    private readonly userPersonaInquiryService: UserPersonaInquiryService,
    private readonly orm: MikroORM<PostgreSqlDriver>
  ) {
    super(userRequiredPersonaInquiryRepo);
    this.logger = new Logger(UserRequiredPersonaInquiryService.name);
    this.em = this.orm.em;
  }

  public async getUserRequiredPersonaInquiryList(
    userId: string,
    {
      purposeList,
      kycCheckStatusList,
    }: Pick<
      GetUserRequiredPersonaInquiryListArgs,
      'purposeList' | 'kycCheckStatusList'
    >
  ): Promise<UserRequiredPersonaInquiry[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const filterQuery: FilterQuery<UserRequiredPersonaInquiry> & {
      $and?: {
        [id in keyof EntityData<UserRequiredPersonaInquiry>]: { $in: any[] };
      }[];
    } = {
      userId,
    };

    if (purposeList && purposeList.length > 0) {
      filterQuery.$and = filterQuery.$and || [];
      filterQuery.$and.push({
        purpose: { $in: purposeList },
      });
    }

    const userRequiredPersonaInquiryList: UserRequiredPersonaInquiry[] =
      await this.find(filterQuery, {
        filters:
          kycCheckStatusList && kycCheckStatusList.length
            ? { withKycStatus: { list: kycCheckStatusList } }
            : undefined,
      });

    return userRequiredPersonaInquiryList;
  }

  public async upsertUserRequiredPersonaInquiryFromList(
    userId: string,
    {
      requiredInquiryList,
    }: Pick<SetUserRequiredPersonaInquiryListArgs, 'requiredInquiryList'>
  ): Promise<UserRequiredPersonaInquiry[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    if (!requiredInquiryList || !requiredInquiryList.length) {
      throw new BadRequestError('Input argument is empty');
    }

    const inquiryObj =
      await this.userPersonaInquiryService.getOrCreateFromInquiryIdList({
        userId,
        inquiryIdList: requiredInquiryList.map(({ inquiryId }) => inquiryId),
        flush: false,
      });

    const userRequiredPersonaInquiryList =
      await this.upsertManyFilteredByProperties({
        data: requiredInquiryList.map(({ inquiryId, purpose }) => ({
          userId,
          purpose,
          inquiry: inquiryObj[inquiryId],
        })),
        propertyList: ['userId', 'purpose'],
        flush: false,
      });

    this.em.flush();

    return userRequiredPersonaInquiryList;
  }
}

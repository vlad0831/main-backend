import { FilterQuery } from '@mikro-orm/core';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UserInputError } from 'apollo-server-core';
import { BaseService } from '../shared/base.service';
import {
  PlaidLinkedItemVerificationStatus,
  UserPlaidLinkedItem,
} from './entities/userPlaidLinkedItem.entity';
import { NotFoundError } from '../shared/errors';
import { PlaidService } from '../plaid/plaid.service';
import { UserPlaidLinkedItemInput } from './dto/userPlaidLinkedItem.input';
import { UserPlaidIdentifierInput } from './dto/userPlaidIdentifier.input';
import { GetUserPlaidLinkedItemsArgs } from './dto/getUserPlaidLinkedItems.args';
import { DriveWealthService } from '../drivewealth/drivewealth.service';
import { UserInvestmentProfileService } from '../user-investment-profile/userInvestmentProfile.service';

@Injectable()
export class UserPlaidLinkedItemService extends BaseService<UserPlaidLinkedItem> {
  protected logger: Logger;
  public constructor(
    @InjectRepository(UserPlaidLinkedItem)
    private readonly userPlaidLinkedItemRepo: EntityRepository<UserPlaidLinkedItem>,
    private readonly plaidService: PlaidService,
    private readonly driveWealthService: DriveWealthService,
    private readonly userInvestmentProfileService: UserInvestmentProfileService
  ) {
    super(userPlaidLinkedItemRepo);
    this.logger = new Logger(UserPlaidLinkedItemService.name);
  }

  public async getUserPlaidLinkedItemList(
    userId: string,
    args: GetUserPlaidLinkedItemsArgs
  ): Promise<UserPlaidLinkedItem[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const filterQuery: FilterQuery<UserPlaidLinkedItem> & {
      $and?: [{ $or: Partial<UserPlaidLinkedItem>[] }];
    } = {
      userId,
      active: true,
    };

    const { plaidLinkedItemList } = args;
    if (plaidLinkedItemList && plaidLinkedItemList.length > 0) {
      const orFilters = plaidLinkedItemList.map((inputItem) => {
        const filter: Partial<UserPlaidLinkedItem> = {};
        if (inputItem.accountId) {
          filter.accountId = inputItem.accountId;
        }
        if (inputItem.userPlaidLinkedItemId) {
          filter.id = inputItem.userPlaidLinkedItemId;
        }

        return filter;
      });
      filterQuery.$and = [{ $or: orFilters }];
    }

    const userPlaidLinkedItemList: UserPlaidLinkedItem[] = await this.find(
      filterQuery
    );

    return userPlaidLinkedItemList;
  }

  public async createUserPlaidLinkedItem(
    userId: string,
    {
      plaidAccountId,
      plaidInstitutionId,
      plaidPublicToken,
    }: UserPlaidLinkedItemInput
  ): Promise<UserPlaidLinkedItem> {
    const { access_token: accessToken, item_id: itemId } =
      await this.plaidService.exchangePublicToken(plaidPublicToken);
    const existingPlaidLinkedItem = await this.findOne({
      itemId,
    });

    if (existingPlaidLinkedItem && existingPlaidLinkedItem.active) {
      throw new BadRequestException('UserPlaidLinkedItem already exists.');
    }

    const getInstitution =
      this.plaidService.getInstitutionById(plaidInstitutionId);
    const getAccount = this.plaidService.getAccount(
      accessToken,
      plaidAccountId
    );
    const getUserInvestmentProfile =
      this.userInvestmentProfileService.getByUserId(userId);
    const institution = await getInstitution;
    const { name, mask, type, subtype, verification_status } = await getAccount;
    const { driveWealthUserId } = await getUserInvestmentProfile;
    const { processor_token: processorToken } =
      await this.plaidService.createProcessorTokenForDriveWealth(
        accessToken,
        plaidAccountId
      );
    const { id: driveWealthAccountId } =
      await this.driveWealthService.createBankAccountViaPlaid({
        userId: driveWealthUserId,
        bankAccountNickname: name,
        processorToken,
      });
    const plaidLinkedItem = {
      userId,
      accessToken,
      itemId,
      institutionId: plaidInstitutionId,
      institutionName: institution.name,
      accountId: plaidAccountId,
      accountName: name,
      accountMask: mask,
      accountType: type,
      accountSubtype: subtype,
      verificationStatus:
        verification_status as unknown as PlaidLinkedItemVerificationStatus,
      driveWealthAccountId,
    };

    const userPlaidLinkedItem = this.create(plaidLinkedItem);
    await this.persistAndFlush(userPlaidLinkedItem);
    return userPlaidLinkedItem;
  }

  public async deleteUserPlaidLinkedItemList(
    userId: string,
    plaidLinkedItemList: Partial<UserPlaidIdentifierInput>[]
  ): Promise<boolean> {
    if (!plaidLinkedItemList.length) {
      throw new UserInputError('Plaid linked item is missing input item');
    }

    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const orFilters: Partial<UserPlaidLinkedItem>[] = plaidLinkedItemList.map(
      (plaidLinkedItem) => {
        const { accountId, userPlaidLinkedItemId } = plaidLinkedItem;
        const query: Partial<UserPlaidLinkedItem> = {};
        if (!accountId && !userPlaidLinkedItemId) {
          throw new UserInputError('Plaid linked item is missing identifier');
        }

        if (accountId) {
          query.accountId = accountId;
        }
        if (userPlaidLinkedItemId) {
          query.id = userPlaidLinkedItemId;
        }

        return query;
      }
    );

    const filterQuery: FilterQuery<UserPlaidLinkedItem> = {
      userId,
      $and: [{ $or: orFilters }],
    };

    await this.nativeUpdate(filterQuery, { active: false });
    const deactivatedAccounts = await this.find(filterQuery);
    const deleteRequests = deactivatedAccounts.map((userPlaidLinkedItem) =>
      this.driveWealthService.deleteBankAccount(
        userPlaidLinkedItem.driveWealthAccountId
      )
    );
    await Promise.allSettled(deleteRequests);
    return true;
  }
}

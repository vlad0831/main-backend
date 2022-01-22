import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BaseService } from '../shared/base.service';
import { UserFundingMethod } from './entities/userFundingMethod.entity';
import { SetFundingMethodInput } from './dto/setFundingMethod.input';
import { UserPlaidLinkedItemService } from '../user-plaid-linked-item/userPlaidLinkedItem.service';
import { UserRecurringFundingSettingService } from '../user-recurring-funding-setting/userRecurringFundingSetting.service';
import { BadRequestError } from '../shared/errors';

@Injectable()
export class UserFundingMethodService extends BaseService<UserFundingMethod> {
  protected logger: Logger;
  public constructor(
    @InjectRepository(UserFundingMethod)
    private readonly userFundingMethodServiceRepo: EntityRepository<UserFundingMethod>,
    private readonly userPlaidLinkedItemService: UserPlaidLinkedItemService,
    private readonly userRecurringFundingSettingService: UserRecurringFundingSettingService
  ) {
    super(userFundingMethodServiceRepo);
    this.logger = new Logger(UserFundingMethod.name);
  }

  public async getUserFundingMethodById(
    fundingMethodId: string
  ): Promise<UserFundingMethod> {
    if (!fundingMethodId) {
      throw new BadRequestError('Funding method id is required');
    }

    const userFundingMethod = await this.getById(fundingMethodId);
    return userFundingMethod;
  }

  public async createUserFundingMethod(
    userId: string,
    userFundingMethodItem: SetFundingMethodInput
  ): Promise<UserFundingMethod> {
    const { method, userPlaidLinkedItemId, recurringFundingSetting } =
      userFundingMethodItem;
    const userPlaidLinkedItemList =
      await this.userPlaidLinkedItemService.getUserPlaidLinkedItemList(userId, {
        userId,
        plaidLinkedItemList: [{ userPlaidLinkedItemId, accountId: undefined }],
      });
    const userFundingMethod: Partial<UserFundingMethod> = {
      userId,
      method,
      plaidLinkedItem: userPlaidLinkedItemList[0],
    };
    const createdUserFundingMethod =
      this.userFundingMethodServiceRepo.create(userFundingMethod);
    await this.userFundingMethodServiceRepo.persistAndFlush(
      createdUserFundingMethod
    );

    await this.userRecurringFundingSettingService.createUserRecurringFundingSetting(
      createdUserFundingMethod,
      recurringFundingSetting
    );

    return createdUserFundingMethod;
  }
}

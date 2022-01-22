import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { v4 } from 'uuid';
import { ForbiddenError } from 'apollo-server-core';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { CurrentUser } from '../auth/decorator/currentUser';
import { PoliciesGuard } from '../auth/policies.guard';
import { Action, RequestUserInfo } from '../auth/types';
import { SetUserFundingMethodArgs } from './dto/setUserFundingMethod.args';
import { GetUserFundingMethodArgs } from './dto/getUserFundingMethod.args';
import { BooleanResultResponse } from '../shared/dto/booleanResult.response';
import { DeleteUserFundingMethodArgs } from './dto/deleteUserFundingMethod.args';
import { UserFundingMethodService } from './userFundingMethod.service';
import {
  PlaidLinkedItemVerificationStatus,
  UserPlaidLinkedItem,
} from '../user-plaid-linked-item/entities/userPlaidLinkedItem.entity';
import {
  FundingMethod,
  UserFundingMethod,
} from './entities/userFundingMethod.entity';
import {
  RecurringFundingFrequency,
  UserRecurringFundingSetting,
} from '../user-recurring-funding-setting/entities/userRecurringFundingSetting.entity';
import { SetFundingMethodInput } from './dto/setFundingMethod.input';

@UseGuards(PoliciesGuard)
@Resolver()
export class UserFundingMethodResolver {
  public constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly userFundingMethodService: UserFundingMethodService
  ) {}

  @Query(() => [UserFundingMethod], { name: 'getUserFundingMethod' })
  public async getUserFundingMethod(
    @Args() args: GetUserFundingMethodArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<UserFundingMethod[]> {
    // const userId = args.userId || requestUser.uuid;
    // await this.caslAbilityFactory.canAccessOrFail({
    //   requestUser,
    //   userId,
    //   action: Action.MODIFY,
    //   subject: {}, // will change to the appropriate table
    //   ForbiddenError,
    // });

    const { methodList } = args;

    const mockFundingMethod = (
      method = FundingMethod.Recurring
    ): UserFundingMethod =>
      ({
        id: v4(),
        active: true,
        method,
        plaidLinkedItem: {
          id: v4(),
          active: true,
          userId: requestUser.uuid,
          itemId: 'item_12345678',
          institutionName: 'mock institution',
          institutionId: 'ins_12345678',
          accountId: 'account_12345678',
          accountName: 'mock account',
          accountMask: '*****1234',
          accountType: 'mock type',
          accountSubtype: 'mock subType',
          verificationStatus:
            PlaidLinkedItemVerificationStatus.AutomaticallyVerified,
        } as UserPlaidLinkedItem,
        recurringFundingSetting:
          method === FundingMethod.Recurring
            ? ({
                id: v4(),
                frequency: RecurringFundingFrequency.Weekly,
                amount: 7.51,
                day: 1,
                currency: 'USD',
                nextExecutionDate: new Date(),
              } as UserRecurringFundingSetting)
            : undefined,
      } as UserFundingMethod);

    return (methodList || [FundingMethod.Recurring]).map(mockFundingMethod);
  }

  @Mutation(() => [UserFundingMethod], {
    name: 'setUserFundingMethod',
  })
  public async setUserFundingMethod(
    @Args() args: SetUserFundingMethodArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<UserFundingMethod[]> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.MODIFY,
      subject: UserFundingMethod,
      ForbiddenError,
    });

    const { fundingMethodList } = args;

    return Promise.all(
      fundingMethodList.map(
        async (fundingMethod: SetFundingMethodInput) =>
          await this.userFundingMethodService.createUserFundingMethod(
            userId,
            fundingMethod
          )
      )
    );
  }

  @Mutation(() => BooleanResultResponse, {
    name: 'deleteUserFundingMethod',
  })
  public async deleteUserFundingMethod(
    @Args() args: DeleteUserFundingMethodArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<BooleanResultResponse> {
    // const userId = args.userId || requestUser.uuid;
    // await this.caslAbilityFactory.canAccessOrFail({
    //   requestUser,
    //   userId,
    //   action: Action.MODIFY,
    //   subject: {}, // will change to the appropriate table
    //   ForbiddenError,
    // });

    return {
      result: true,
    };
  }
}

import { Logger, UseGuards } from '@nestjs/common';
import { Mutation } from '@nestjs/graphql';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-core';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { CurrentUser } from '../auth/decorator/currentUser';
import { PoliciesGuard } from '../auth/policies.guard';
import { Action, RequestUserInfo } from '../auth/types';
import { GetUserFundingTransactionArgs } from './dto/getUserFundingTransaction.args';
import { TransferMoneyArgs } from './dto/transferMoney.args';
import { TransferMoneyResponse } from './dto/transferMoney.response';
import { UserFundingTransaction } from './entities/userFundingTransaction.entity';
import { UserFundingTransactionService } from './userFundingTransaction.service';

@Resolver()
export class UserFundingTransactionResolver {
  private readonly logger: Logger;
  public constructor(
    private readonly userFundingTransactionService: UserFundingTransactionService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {
    this.logger = new Logger(UserFundingTransactionResolver.name);
  }

  @Query(() => [UserFundingTransaction], {
    name: 'getUserFundingTransaction',
  })
  public async getUserFundingTransaction(
    @Args() args: GetUserFundingTransactionArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<UserFundingTransaction[]> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.READ,
      subject: UserFundingTransaction,
      ForbiddenError,
    });

    return this.userFundingTransactionService.getUserFundingTransaction(userId);
  }

  @Mutation(() => TransferMoneyResponse, {
    name: 'transferMoney',
  })
  public async transferMoney(
    @Args() args: TransferMoneyArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<TransferMoneyResponse> {
    // TODO: Make transaction.
    // const { amount, fromAccountId, toAccountId, userId } = args;

    return {
      isSuccess: true,
      message: 'Your transfer has been completed successfully!',
    };
  }
}

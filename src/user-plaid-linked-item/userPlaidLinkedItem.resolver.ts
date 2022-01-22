import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-core';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { CurrentUser } from '../auth/decorator/currentUser';
import { PoliciesGuard } from '../auth/policies.guard';
import { Action, RequestUserInfo } from '../auth/types';
import { UserPlaidLinkedItemService } from './userPlaidLinkedItem.service';
import { UserPlaidLinkedItem } from './entities/userPlaidLinkedItem.entity';
import { SetUserPlaidLinkedItemArgs } from './dto/setUserPlaidLinkedItem.args';
import { UserPlaidLinkedItemInput } from './dto/userPlaidLinkedItem.input';
import { BooleanResultResponse } from '../shared/dto/booleanResult.response';
import { DeleteUserPlaidLinkedItemArgs } from './dto/deleteUserPlaidLinkedItem.args';
import { GetUserPlaidLinkedItemsArgs } from './dto/getUserPlaidLinkedItems.args';

@UseGuards(PoliciesGuard)
@Resolver()
export class UserPlaidLinkedItemResolver {
  private readonly logger: Logger;
  public constructor(
    private readonly userPlaidLinkedItemService: UserPlaidLinkedItemService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {
    this.logger = new Logger(UserPlaidLinkedItemResolver.name);
  }

  @Query(() => [UserPlaidLinkedItem], { name: 'getUserPlaidLinkedItems' })
  async getUserPlaidLinkedItems(
    @Args() args: GetUserPlaidLinkedItemsArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ) {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.READ,
      subject: UserPlaidLinkedItem,
      ForbiddenError,
    });

    return this.userPlaidLinkedItemService.getUserPlaidLinkedItemList(
      userId,
      args
    );
  }

  @Mutation(() => [UserPlaidLinkedItem], {
    name: 'setUserPlaidLinkedItem',
  })
  async setUserPlaidLinkedItem(
    @Args() args: SetUserPlaidLinkedItemArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<UserPlaidLinkedItem[]> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.MODIFY,
      subject: UserPlaidLinkedItem,
      ForbiddenError,
    });

    const { plaidLinkedItemList } = args;

    return Promise.all(
      plaidLinkedItemList.map(
        async (plaidLinkedItem: UserPlaidLinkedItemInput) =>
          await this.userPlaidLinkedItemService.createUserPlaidLinkedItem(
            userId,
            plaidLinkedItem
          )
      )
    );
  }

  @Mutation(() => BooleanResultResponse, {
    name: 'deleteUserPlaidLinkedItem',
  })
  public async deleteUserPlaidLinkedItem(
    @Args() args: DeleteUserPlaidLinkedItemArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<BooleanResultResponse> {
    const userId = args.userId || requestUser.uuid;

    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.MODIFY,
      subject: UserPlaidLinkedItem,
      ForbiddenError,
    });

    const result =
      await this.userPlaidLinkedItemService.deleteUserPlaidLinkedItemList(
        userId,
        args.plaidLinkedItemList
      );

    return { result };
  }
}

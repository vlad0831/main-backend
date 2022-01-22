import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-core';
import { PlaidApi } from 'plaid';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { CurrentUser } from '../auth/decorator/currentUser';
import { PoliciesGuard } from '../auth/policies.guard';
import { Action, RequestUserInfo } from '../auth/types';
import { PlaidService } from '../plaid/plaid.service';

@UseGuards(PoliciesGuard)
@Resolver()
export class PlaidResolver {
  public constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly plaidService: PlaidService
  ) {}

  @Query(() => String, { name: 'getPlaidLinkToken' })
  async createPlaidLinkToken(
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<string> {
    const { uuid } = requestUser;

    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId: uuid,
      action: Action.ACCESS,
      subject: PlaidApi,
      ForbiddenError,
    });

    const res = await this.plaidService.createLinkToken(uuid);

    return res.link_token;
  }
}

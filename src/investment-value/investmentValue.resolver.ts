import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-core';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { CurrentUser } from '../auth/decorator/currentUser';
import { PoliciesGuard } from '../auth/policies.guard';
import { Action, RequestUserInfo } from '../auth/types';
import { GetUserInvestmentValueArgs } from './dto/getInvestmentValue.args';
import { InvestmentValue } from './entities/investmentValue.entity';
import { UserInvestmentValue } from './entities/userInvestmentValue.entity';
import { UserInvestmentValueService } from './userInvestmentValue.service';

@UseGuards(PoliciesGuard)
@Resolver()
export class InvestmentValueResolver {
  public constructor(
    private readonly userInvestmentValueService: UserInvestmentValueService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  @Query(() => [InvestmentValue], { name: 'getUserInvestmentValueList' })
  async getUserInvestmentValueList(
    @Args() args: GetUserInvestmentValueArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<InvestmentValue[]> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.READ,
      subject: UserInvestmentValue,
      ForbiddenError,
    });

    const userInvestmentValueList =
      await this.userInvestmentValueService.getUserInvestmentValueList(userId);

    return userInvestmentValueList;
  }
}

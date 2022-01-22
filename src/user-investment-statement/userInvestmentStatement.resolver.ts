import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PoliciesGuard } from '../auth/policies.guard';
import { InvestmentStatementItemResponse } from './dto/investmentStatementItem.response';
import { GetUserInvestmentStatementsArgs } from './dto/getUserInvestmentStatements.args';
import { CurrentUser } from '../auth/decorator/currentUser';
import { Action, RequestUserInfo } from '../auth/types';
import { UserInvestmentStatementService } from './userInvestmentStatement.service';
import { UserInvestmentProfile } from '../user-investment-profile/entities/userInvestmentProfile.entity';
import { ForbiddenError } from 'apollo-server-core';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';

@UseGuards(PoliciesGuard)
@Resolver()
export class UserInvestmentStatementResolver {
  public constructor(
    private readonly userInvestmentStatementService: UserInvestmentStatementService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  @Query(() => [InvestmentStatementItemResponse], {
    name: 'getUserInvestmentStatements',
  })
  public async getUserInvestmentStatements(
    @Args() args: GetUserInvestmentStatementsArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<InvestmentStatementItemResponse[]> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.READ,
      subject: UserInvestmentProfile,
      ForbiddenError,
    });

    return this.userInvestmentStatementService.getUserInvestmentStatements(
      userId,
      args
    );
  }
}

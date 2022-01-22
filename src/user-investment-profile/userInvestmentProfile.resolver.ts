import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PoliciesGuard } from '../auth/policies.guard';
import { UserInvestmentProfileService } from './userInvestmentProfile.service';
import { GetUserInvestmentProfileSummaryArgs } from './dto/getUserInvestmentProfileSummary.args';
import { InvestmentProfileSummaryResponse } from './dto/investmentProfileSummary.response';
import { Action, RequestUserInfo } from '../auth/types';
import { ForbiddenError } from 'apollo-server-core';
import { CurrentUser } from '../auth/decorator/currentUser';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { UserInvestmentProfile } from './entities/userInvestmentProfile.entity';
import { InvestmentPerformanceItemResponse } from './dto/investmentPerformanceItem.response';
import { GetUserInvestmentPerformanceArgs } from './dto/getUserInvestmentPerformance.args';

@UseGuards(PoliciesGuard)
@Resolver()
export class UserInvestmentProfileResolver {
  public constructor(
    private readonly userInvestmentProfileService: UserInvestmentProfileService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  @Query(() => InvestmentProfileSummaryResponse, {
    name: 'getUserInvestmentProfileSummary',
    nullable: true,
  })
  public async getUserInvestmentProfileSummary(
    @Args() args: GetUserInvestmentProfileSummaryArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<InvestmentProfileSummaryResponse | undefined> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.READ,
      subject: UserInvestmentProfile,
      ForbiddenError,
    });

    return this.userInvestmentProfileService.getUserInvestmentProfileSummary(
      userId
    );
  }

  @Query(() => [InvestmentPerformanceItemResponse], {
    name: 'getUserInvestmentPerformance',
  })
  public async getUserInvestmentPerformance(
    @Args() args: GetUserInvestmentPerformanceArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<InvestmentPerformanceItemResponse[]> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.READ,
      subject: UserInvestmentProfile,
      ForbiddenError,
    });

    return this.userInvestmentProfileService.getUserInvestmentPerformance(
      userId,
      args
    );
  }
}

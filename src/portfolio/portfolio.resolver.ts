import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRecommendedPortfolio } from './entities/userRecommendedPortfolio.entity';
import { UseGuards } from '@nestjs/common';
import { PoliciesGuard } from '../auth/policies.guard';
import { UserRecommendedPortfolioService } from './userRecommendedPortfolio.service';
import { Action, RequestUserInfo } from '../auth/types';
import { ForbiddenError } from 'apollo-server-core';
import { GetUserRecommendedPortfolioAssetsArgs } from './dto/getUserRecommendedPortfolioAssets.args';
import { CurrentUser } from '../auth/decorator/currentUser';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { RecommendedPortfolioAssetResponseItem } from './dto/recommendedPortfolioAssetResponseItem';

@UseGuards(PoliciesGuard)
@Resolver()
export class PortfolioResolver {
  public constructor(
    private readonly userRecommendedPortfolioService: UserRecommendedPortfolioService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  @Query(() => [RecommendedPortfolioAssetResponseItem], {
    name: 'getUserRecommendedPortfolio',
  })
  public async getUserRecommendedPortfolio(
    @Args() args: GetUserRecommendedPortfolioAssetsArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<RecommendedPortfolioAssetResponseItem[]> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.READ,
      subject: UserRecommendedPortfolio,
      ForbiddenError,
    });

    return this.userRecommendedPortfolioService.getRecommendedPortfolio(
      userId,
      args
    );
  }
}

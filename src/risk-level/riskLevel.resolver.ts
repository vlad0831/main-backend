import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRiskLevel } from './entities/userRiskLevel.entity';
import { GetUserRiskLevelArgs } from './dto/getUserRiskLevel.args';
import { UserRiskLevelService } from './userRiskLevel.service';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { CurrentUser } from '../auth/decorator/currentUser';
import { Action, RequestUserInfo } from '../auth/types';
import { ForbiddenError } from 'apollo-server-core';
import { UseGuards, Logger } from '@nestjs/common';
import { PoliciesGuard } from '../auth/policies.guard';

@UseGuards(PoliciesGuard)
@Resolver()
export class RiskLevelResolver {
  private readonly logger: Logger;
  public constructor(
    private readonly userRiskLevelService: UserRiskLevelService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {
    this.logger = new Logger(RiskLevelResolver.name);
  }

  @Query(() => UserRiskLevel, { name: 'getUserRiskLevel' })
  async getUserRiskLevel(
    @Args() args: GetUserRiskLevelArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<UserRiskLevel> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.READ,
      subject: UserRiskLevel,
      ForbiddenError,
    });

    return await this.userRiskLevelService.getUserRiskLevel(userId);
  }
}

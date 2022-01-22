import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetStaticAssetListArgs } from './dto/getStaticAssetList.args';
import { StaticAssetService } from './staticAsset.service';
import { StaticAssetResponseItem } from './dto/staticAssetResponseItem';
import { UseGuards } from '@nestjs/common';
import { PoliciesGuard } from '../auth/policies.guard';
import { NoJwt } from '../auth/decorator/noJwt';
import { SetStaticAssetListArgs } from './dto/setStaticAssetList.args';
import { Action, RequestUserInfo } from '../auth/types';
import { ForbiddenError } from 'apollo-server-core';
import { CurrentUser } from '../auth/decorator/currentUser';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { StaticAssetAllocation } from './entities/staticAssetAllocation.entity';

@UseGuards(PoliciesGuard)
@Resolver()
export class StaticAssetResolver {
  public constructor(
    private readonly staticAssetService: StaticAssetService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  @NoJwt()
  @Query(() => [StaticAssetResponseItem], { name: 'getStaticAssetList' })
  public async getStaticAssetList(
    @Args() args: GetStaticAssetListArgs
  ): Promise<StaticAssetResponseItem[]> {
    return this.staticAssetService.getStaticAssetList(args);
  }

  @Mutation(() => [StaticAssetResponseItem], { name: 'setStaticAssetList' })
  public async setStaticAssetList(
    @Args() args: SetStaticAssetListArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<StaticAssetResponseItem[]> {
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId: requestUser.uuid,
      action: Action.MODIFY,
      subject: StaticAssetAllocation,
      ForbiddenError,
    });
    return this.staticAssetService.setStaticAssetList(args);
  }
}

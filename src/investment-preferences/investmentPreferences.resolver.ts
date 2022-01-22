import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InvestmentPreferencesSettingsResponse } from './dto/investmentPreferencesSettings.response';
import { InvestmentPreferencesService } from './investmentPreferences.service';
import { PoliciesGuard } from '../auth/policies.guard';
import { UseGuards } from '@nestjs/common';
import { NoJwt } from '../auth/decorator/noJwt';
import { UserInvestmentPreferences } from './dto/userInvestmentPreferences';
import { Action, RequestUserInfo } from '../auth/types';
import { ForbiddenError } from 'apollo-server-core';
import { GetUserInvestmentPreferencesArgs } from './dto/getUserInvestmentPreferences.args';
import { CurrentUser } from '../auth/decorator/currentUser';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { SetUserInvestmentPreferencesArgs } from './dto/setUserInvestmentPreferences.args';
import { UserAssetClass } from '../user-asset-class/entities/userAssetClass.entity';

@UseGuards(PoliciesGuard)
@Resolver()
export class InvestmentPreferencesResolver {
  public constructor(
    private readonly investmentPreferencesService: InvestmentPreferencesService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  @NoJwt()
  @Query(() => InvestmentPreferencesSettingsResponse, {
    name: 'getInvestmentPreferencesSettings',
  })
  public getInvestmentPreferencesSettings(): Promise<InvestmentPreferencesSettingsResponse> {
    return this.investmentPreferencesService.getInvestmentPreferencesSettings();
  }

  @Query(() => UserInvestmentPreferences, {
    name: 'getUserInvestmentPreferences',
  })
  public async getUserInvestmentPreferences(
    @Args() args: GetUserInvestmentPreferencesArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<UserInvestmentPreferences> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.READ,
      subject: UserAssetClass,
      ForbiddenError,
    });

    return this.investmentPreferencesService.getUserInvestmentPreferences(
      userId
    );
  }

  @Mutation(() => UserInvestmentPreferences, {
    name: 'setUserInvestmentPreferences',
  })
  public async setUserInvestmentPreferences(
    @Args() args: SetUserInvestmentPreferencesArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<UserInvestmentPreferences> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.MODIFY,
      subject: UserAssetClass,
      ForbiddenError,
    });

    return this.investmentPreferencesService.setUserInvestmentPreferences(
      userId,
      args
    );
  }
}

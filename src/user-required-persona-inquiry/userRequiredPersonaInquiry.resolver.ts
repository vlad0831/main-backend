import { Logger, UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-core';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { CurrentUser } from '../auth/decorator/currentUser';
import { PoliciesGuard } from '../auth/policies.guard';
import { Action, RequestUserInfo } from '../auth/types';
import { GetUserRequiredPersonaInquiryListArgs } from './dto/getUserRequiredPersonaInquiryList.args';
import { SetUserRequiredPersonaInquiryListArgs } from './dto/setUserReqruiedPersonaInquiryList.args';
import { UserRequiredPersonaInquiry } from './entities/userRequiredPersonaInquiry.entity';
import { UserRequiredPersonaInquiryService } from './userRequiredPersonaInquiry.service';

@UseGuards(PoliciesGuard)
@Resolver()
export class UserRequiredPersonaInquiryResolver {
  private readonly logger: Logger;
  public constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly userRequiredPersonaInquiryService: UserRequiredPersonaInquiryService
  ) {
    this.logger = new Logger(UserRequiredPersonaInquiryResolver.name);
  }

  @Query(() => [UserRequiredPersonaInquiry], {
    name: 'getUserRequiredPersonaInquiryList',
  })
  async getUserRequiredPersonaInquiryList(
    @Args() args: GetUserRequiredPersonaInquiryListArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<UserRequiredPersonaInquiry[]> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.READ,
      subject: UserRequiredPersonaInquiry,
      ForbiddenError,
    });

    return this.userRequiredPersonaInquiryService.getUserRequiredPersonaInquiryList(
      userId,
      args
    );
  }

  @Mutation(() => [UserRequiredPersonaInquiry], {
    name: 'setUserRequiredPersonaInquiryList',
  })
  async setUserRequiredPersonaInquiryList(
    @Args() args: SetUserRequiredPersonaInquiryListArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<UserRequiredPersonaInquiry[]> {
    const userId = args.userId || requestUser.uuid;
    await this.caslAbilityFactory.canAccessOrFail({
      requestUser,
      userId,
      action: Action.MODIFY,
      subject: UserRequiredPersonaInquiry,
      ForbiddenError,
    });

    return this.userRequiredPersonaInquiryService.upsertUserRequiredPersonaInquiryFromList(
      userId,
      args
    );
  }
}

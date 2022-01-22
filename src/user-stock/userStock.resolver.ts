import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { v4 } from 'uuid';
import { CaslAbilityFactory } from '../auth/casl-ability.factory';
import { CurrentUser } from '../auth/decorator/currentUser';
import { PoliciesGuard } from '../auth/policies.guard';
import { RequestUserInfo } from '../auth/types';
import { GetUserStockResponse } from './dto/getUserStock.response';
import { GetUserStockArgs } from './dto/getUserStock.args';

@UseGuards(PoliciesGuard)
@Resolver()
export class UserStockResolver {
  public constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {}

  @Query(() => [GetUserStockResponse], { name: 'getUserStock' })
  public async getUserStock(
    @Args() args: GetUserStockArgs,
    @CurrentUser() requestUser: RequestUserInfo
  ): Promise<GetUserStockResponse[]> {
    const mockStock: GetUserStockResponse = {
      id: v4(),
      category: 'category1',
      name: 'stock1',
      description: 'description1',
    };

    return [mockStock];
  }
}

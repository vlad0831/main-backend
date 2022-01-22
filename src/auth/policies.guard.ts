import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestObject } from '../shared/types';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CHECK_POLICIES } from './decorator/checkPolicies';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PolicyHandler } from './types';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PoliciesGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    protected readonly reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const isGql = context.getType<GqlContextType>() === 'graphql';
    const ctx = isGql ? GqlExecutionContext.create(context) : context;

    const policyHandlers =
      this.reflector.getAllAndMerge<PolicyHandler[]>(CHECK_POLICIES, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) || [];

    if (policyHandlers.length) {
      const req = isGql
        ? (ctx as GqlExecutionContext).getContext().req
        : context.switchToHttp().getRequest<RequestObject>();

      const ability = await this.caslAbilityFactory.createForRequestUser({
        requestUser: req.user,
      });

      const result = policyHandlers.every(
        this.caslAbilityFactory.execPolicyHandlerFactory(ability, context)
      );

      if (!result) {
        return false;
      }
    }

    return true;
  }
}

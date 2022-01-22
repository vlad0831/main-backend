import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { NO_JWT } from './decorator/noJwt';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(protected readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req;
    }

    return context.switchToHttp().getRequest();
  }

  canActivate(context: ExecutionContext) {
    const isNonJwt = this.reflector.getAllAndOverride<boolean>(NO_JWT, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isNonJwt) {
      return true;
    }

    return super.canActivate(context);
  }
}

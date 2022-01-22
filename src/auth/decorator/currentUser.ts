import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    ctx.getType<GqlContextType>() === 'graphql'
      ? GqlExecutionContext.create(ctx).getContext().req.user
      : ctx.switchToHttp().getRequest().user
);

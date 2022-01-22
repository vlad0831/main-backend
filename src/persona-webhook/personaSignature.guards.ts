import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';
import { PersonaWebhookService } from './personaWebhook.service';

@Injectable()
export class PersonaSignatureGuard implements CanActivate {
  constructor(private readonly personaWebhookService: PersonaWebhookService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isGql = context.getType<GqlContextType>() === 'graphql';
    const ctx = isGql ? GqlExecutionContext.create(context) : context;

    const req: FastifyRequest = isGql
      ? (ctx as GqlExecutionContext).getContext().req
      : context.switchToHttp().getRequest();

    const personaSignature = req.headers['persona-signature'] as string;
    const rawBody = req.rawBody.toString('utf8');
    const { ip, routerPath } = req;
    const lastSubPath = routerPath.substring(routerPath.lastIndexOf('/') + 1);

    return (
      this.personaWebhookService.validatePersonaWebhookIpSource(ip) &&
      this.personaWebhookService.validatePersonaWebhookSignature({
        personaSignature,
        path: lastSubPath,
        rawBody,
      })
    );
  }
}

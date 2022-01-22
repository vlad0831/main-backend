import { FastifyRequest } from 'fastify';
import { RequestUserInfo } from '../auth/types';

export interface RequestGenericInterface {
  params?: unknown;
  body?: unknown;
  query?: unknown;
  headers?: unknown;
}

export interface RequestObject<
  RequestGeneric extends RequestGenericInterface = RequestGenericInterface
> extends FastifyRequest<{
    Querystring: RequestGeneric['query'];
    Params: RequestGeneric['params'];
    Body: RequestGeneric['body'];
    Headers: RequestGeneric['headers'];
  }> {
  user?: RequestUserInfo;
}

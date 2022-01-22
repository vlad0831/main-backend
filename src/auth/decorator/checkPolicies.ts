import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from '../types';

export const CHECK_POLICIES = 'CHECK_POLICIES';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES, handlers);

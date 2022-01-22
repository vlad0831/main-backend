import { FilterQuery } from '@mikro-orm/core';
import {
  KycCheckStatus,
  UserRequiredPersonaInquiry,
} from '../entities/userRequiredPersonaInquiry.entity';

export function getStatusFilterQuery(
  statusList: KycCheckStatus[]
): FilterQuery<UserRequiredPersonaInquiry> {
  const kycStatusSet = new Set(statusList);

  const filterArray: string[] = [];
  if (
    kycStatusSet.has(KycCheckStatus.pending) !==
    kycStatusSet.has(KycCheckStatus.approved)
  ) {
    filterArray.push(KycCheckStatus.approved);
  }
  if (
    kycStatusSet.has(KycCheckStatus.pending) !==
    kycStatusSet.has(KycCheckStatus.declined)
  ) {
    filterArray.push(KycCheckStatus.declined);
  }

  return filterArray.length
    ? {
        inquiry: {
          status: {
            [kycStatusSet.has(KycCheckStatus.pending) ? '$nin' : '$in']:
              filterArray,
          },
        },
      }
    : {};
}

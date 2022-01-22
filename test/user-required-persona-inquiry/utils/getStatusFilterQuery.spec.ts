import { KycCheckStatus } from '../../../src/user-required-persona-inquiry/entities/userRequiredPersonaInquiry.entity';
import { getStatusFilterQuery } from '../../../src/user-required-persona-inquiry/utils/getStatusFilterQuery';

describe('getStatusFilterQuery', () => {
  describe('getStatusFilterQuery', () => {
    it('should return empty object {} for empty list input', () => {
      const mockList: KycCheckStatus[] = [];
      const result = getStatusFilterQuery(mockList);
      expect(result).toEqual({});
    });

    it('should return empty object {} for all kyc check status in the list input', () => {
      const mockList: KycCheckStatus[] = [
        KycCheckStatus.approved,
        KycCheckStatus.declined,
        KycCheckStatus.pending,
      ];
      const result = getStatusFilterQuery(mockList);
      expect(result).toEqual({});
    });

    describe('should return the correct filter query for different combo', () => {
      let mockList: KycCheckStatus[];
      let result: any;
      let expectedResult: any;

      it('should return the correct filter for ["approved"]', () => {
        mockList = [KycCheckStatus.approved];
        expectedResult = { inquiry: { status: { $in: ['approved'] } } };
        result = getStatusFilterQuery(mockList);
        expect(result).toEqual(expectedResult);
      });

      it('should return the correct filter for ["approved", "declined"]', () => {
        mockList = [KycCheckStatus.approved, KycCheckStatus.declined];
        expectedResult = {
          inquiry: { status: { $in: ['approved', 'declined'] } },
        };
        result = getStatusFilterQuery(mockList);
        expect(result).toEqual(expectedResult);
      });

      it('should return the correct filter for ["declined"]', () => {
        mockList = [KycCheckStatus.declined];
        expectedResult = {
          inquiry: { status: { $in: ['declined'] } },
        };
        result = getStatusFilterQuery(mockList);
        expect(result).toEqual(expectedResult);
      });

      it('should return the correct filter for ["pending"]', () => {
        mockList = [KycCheckStatus.pending];
        expectedResult = {
          inquiry: { status: { $nin: ['approved', 'declined'] } },
        };
        result = getStatusFilterQuery(mockList);
        expect(result).toEqual(expectedResult);
      });

      it('should return the correct filter for ["pending", "approved"]', () => {
        mockList = [KycCheckStatus.pending, KycCheckStatus.approved];
        expectedResult = {
          inquiry: { status: { $nin: ['declined'] } },
        };
        result = getStatusFilterQuery(mockList);
        expect(result).toEqual(expectedResult);
      });

      it('should return the correct filter for ["pending", "declined"]', () => {
        mockList = [KycCheckStatus.pending, KycCheckStatus.declined];
        expectedResult = {
          inquiry: { status: { $nin: ['approved'] } },
        };
        result = getStatusFilterQuery(mockList);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});

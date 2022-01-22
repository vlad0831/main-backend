import { ApiProperty } from '@nestjs/swagger';
import { Ability } from '@casl/ability';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { ExecutionContext } from '@nestjs/common';
import { UserInvestmentQuestionnaireAnswer } from '../user-investment-questionnaire/entities/userInvestmentQuestionnaireAnswer.entity';
import { UserRiskLevel } from '../risk-level/entities/userRiskLevel.entity';
import { UserAssetClass } from '../user-asset-class/entities/userAssetClass.entity';
import { UserInvestmentValue } from '../investment-value/entities/userInvestmentValue.entity';
import { InvestmentValue } from '../investment-value/entities/investmentValue.entity';
import { StaticAssetAllocation } from '../static-asset/entities/staticAssetAllocation.entity';
import { registerEnumType } from '@nestjs/graphql';
import { UserRecommendedPortfolio } from '../portfolio/entities/userRecommendedPortfolio.entity';
import { UserPlaidLinkedItem } from '../user-plaid-linked-item/entities/userPlaidLinkedItem.entity';
import { PlaidApi } from 'plaid';
import { UserFundingMethod } from '../user-funding-method/entities/userFundingMethod.entity';
import { UserRecurringFundingSetting } from '../user-recurring-funding-setting/entities/userRecurringFundingSetting.entity';
import { UserFundingTransaction } from '../user-funding-transaction/entities/userFundingTransaction.entity';
import { UserInvestmentProfile } from '../user-investment-profile/entities/userInvestmentProfile.entity';
import { AssetClass } from '../asset-class/entities/assetClass.entity';
import { InvestmentQuestionnaire } from '../investment-questionnaire/entities/investmentQuestionnaire.entity';
import { InvestmentQuestionnaireOption } from '../investment-questionnaire/entities/investmentQuestionnaireOption.entity';
import { RiskLevel } from '../risk-level/entities/riskLevel.entity';
import { S3StaticAsset } from '../static-asset/entities/s3StaticAsset.entity';
import { TextStaticAsset } from '../static-asset/entities/textStaticAsset.entity';
import { UserPersonaInquiry } from '../user-persona-inquiry/entities/userPersonaInquiry.entity';
import { UserRequiredPersonaInquiry } from '../user-required-persona-inquiry/entities/userRequiredPersonaInquiry.entity';

export class RegisterRequestDTO {
  @ApiProperty({
    example: 'John',
    description: 'nickname, optional',
    required: false,
  })
  nickname?: string;

  @ApiProperty({
    example: 'john.smith@example.com',
    description: 'A email is required for login',
  })
  email: string;

  @ApiProperty({
    example: 'password',
    description:
      'The password must include an Uppercase letter, a lowercase letter, a number and a special character.',
  })
  password: string;

  @ApiProperty({
    example: '+1415000000',
    description: 'phone number with the plus sign, optional',
    required: false,
  })
  phone_number?: string;
}

export class AuthenticateRequestDTO {
  @ApiProperty({
    example: 'john.smith@example.com',
    description: 'email or phone number for login',
  })
  identity: string;

  @ApiProperty({
    example: 'password',
    description: 'password',
  })
  password: string;
}

export class OptionalUserIdRequestDTO {
  @ApiProperty({
    example: 'b8dd9d97-37da-44cb-9e9f-96da62f6d415',
    description: 'AWS Cognito user id',
    required: false,
  })
  userId?: string;
}

export class RefreshRequestDTO {
  @ApiProperty({
    example: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ',
    description: 'AWS Cognito refresh token',
  })
  refreshToken: string;
}

export class TokenResponseDTO {
  @ApiProperty({
    example: 'b8dd9d97-37da-44cb-9e9f-96da62f6d415',
    description: 'AWS Cognito user id',
  })
  userId: string;

  @ApiProperty({
    example: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ',
    description: 'AWS Cognito id token',
  })
  idToken: string;

  @ApiProperty({
    example: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ',
    description: 'AWS Cognito access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ',
    description: 'AWS Cognito refresh token',
  })
  refreshToken: string;
}

export class CodeDeliveryDetailsDTO {
  @ApiProperty({
    example: 'email',
    description: 'attribute name',
  })
  attributeName: string;

  @ApiProperty({
    example: 'EMAIL',
    description: 'delivery medium',
  })
  deliveryMedium: string;

  @ApiProperty({
    example: 'j***@e***.com',
    description: 'destination',
  })
  destination: string;
}

export class RestoreUserDTO extends OptionalUserIdRequestDTO {
  @ApiProperty({
    example: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ',
    description: 'AWS Cognito id token',
  })
  idToken: string;

  @ApiProperty({
    example: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ',
    description: 'AWS Cognito access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ',
    description: 'AWS Cognito refresh token',
    required: false,
  })
  refreshToken?: string;
}

export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  ACCESS = 'access',
  MODIFY = 'modify',
}

export type Subjects =
  | typeof AssetClass
  | AssetClass
  | typeof CognitoUserPool
  | CognitoUserPool
  | typeof InvestmentQuestionnaire
  | InvestmentQuestionnaire
  | typeof InvestmentQuestionnaireOption
  | InvestmentQuestionnaireOption
  | typeof InvestmentValue
  | InvestmentValue
  | typeof PlaidApi
  | PlaidApi
  | typeof RiskLevel
  | RiskLevel
  | typeof S3StaticAsset
  | S3StaticAsset
  | typeof StaticAssetAllocation
  | StaticAssetAllocation
  | typeof TextStaticAsset
  | TextStaticAsset
  | typeof UserAssetClass
  | UserAssetClass
  | typeof UserFundingMethod
  | UserFundingMethod
  | typeof UserFundingTransaction
  | UserFundingTransaction
  | typeof UserInvestmentProfile
  | UserInvestmentProfile
  | typeof UserInvestmentQuestionnaireAnswer
  | UserInvestmentQuestionnaireAnswer
  | typeof UserInvestmentValue
  | UserInvestmentValue
  | typeof UserPersonaInquiry
  | UserPersonaInquiry
  | typeof UserPlaidLinkedItem
  | UserPlaidLinkedItem
  | typeof UserRecommendedPortfolio
  | UserRecommendedPortfolio
  | typeof UserRecurringFundingSetting
  | UserRecurringFundingSetting
  | typeof UserRequiredPersonaInquiry
  | UserRequiredPersonaInquiry
  | typeof UserRiskLevel
  | UserRiskLevel
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

type PolicyHandlerCallback = (
  ability: AppAbility,
  context: ExecutionContext
) => boolean;

interface PolicyHandlerObject {
  handle: PolicyHandlerCallback;
}

export type PolicyHandler = PolicyHandlerObject | PolicyHandlerCallback;

export interface RequestUserInfo {
  uuid: string;
  identity: string;
  roles: Roles[];
}

export enum Roles {
  Admin = 'Admin',
}

registerEnumType(Roles, {
  name: 'Roles',
  description: 'available user roles',
});

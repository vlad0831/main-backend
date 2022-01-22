import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  createAliasResolver,
  ExtractSubjectType,
} from '@casl/ability';
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { PlaidApi } from 'plaid';
import {
  Action,
  AppAbility,
  PolicyHandler,
  RequestUserInfo,
  Roles,
  Subjects,
} from './types';
import { UserInvestmentQuestionnaireAnswer } from '../user-investment-questionnaire/entities/userInvestmentQuestionnaireAnswer.entity';
import { UserRiskLevel } from '../risk-level/entities/userRiskLevel.entity';
import { UserAssetClass } from '../user-asset-class/entities/userAssetClass.entity';
import { UserInvestmentValue } from '../investment-value/entities/userInvestmentValue.entity';
import { UserRecommendedPortfolio } from '../portfolio/entities/userRecommendedPortfolio.entity';
import { UserPlaidLinkedItem } from '../user-plaid-linked-item/entities/userPlaidLinkedItem.entity';
import { UserFundingTransaction } from '../user-funding-transaction/entities/userFundingTransaction.entity';
import { UserFundingMethod } from '../user-funding-method/entities/userFundingMethod.entity';
import { UserInvestmentProfile } from '../user-investment-profile/entities/userInvestmentProfile.entity';
import { UserRequiredPersonaInquiry } from '../user-required-persona-inquiry/entities/userRequiredPersonaInquiry.entity';
import { UserPersonaInquiry } from '../user-persona-inquiry/entities/userPersonaInquiry.entity';

const resolveAction = createAliasResolver({
  [Action.MODIFY]: [Action.UPDATE, Action.DELETE],
  [Action.ACCESS]: [Action.READ, Action.MODIFY],
}) as (action: Action | Action[]) => Action | Action[];

export interface CheckPolicyAccessProps {
  requestUser: RequestUserInfo;
  userId: string;
  action?: Action;
  subject?: Subjects;
  canParams?: {
    action: Action;
    subject: Subjects;
    field?: string;
  }[];
}
@Injectable()
export class CaslAbilityFactory {
  async createForRequestUser({
    requestUser,
    isMatchedUser,
  }: {
    requestUser: RequestUserInfo;
    isMatchedUser?: boolean;
  }) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>
    );

    const isAdmin = requestUser?.roles.some((role) => role === Roles.Admin);

    if (isAdmin) {
      // for admin user
      can(Action.MANAGE, 'all');
    } else if (isMatchedUser !== false) {
      // for non-admin and non-not-matched user
      cannot(Action.DELETE, 'all');
      can(Action.READ, 'all');
      if (isMatchedUser === true) {
        // for matched user
        can(Action.MODIFY, CognitoUserPool);
        can(Action.ACCESS, PlaidApi);
        can(Action.ACCESS, UserInvestmentQuestionnaireAnswer);
        can(Action.ACCESS, UserRiskLevel);
        can(Action.ACCESS, UserAssetClass);
        can(Action.ACCESS, UserInvestmentValue);
        can(Action.READ, UserRecommendedPortfolio);
        can(Action.MODIFY, UserPlaidLinkedItem);
        can(Action.READ, UserFundingTransaction);
        can(Action.MODIFY, UserFundingMethod);
        can(Action.READ, UserInvestmentProfile);
        can(Action.READ, UserPersonaInquiry);
        can(Action.MODIFY, UserRequiredPersonaInquiry);
      }
    }

    return build({
      resolveAction,
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  execPolicyHandler({
    handler,
    ability,
    context,
  }: {
    handler: PolicyHandler;
    ability: AppAbility;
    context: ExecutionContext;
  }) {
    if (typeof handler === 'function') {
      return handler(ability, context);
    }
    return handler.handle(ability, context);
  }

  execPolicyHandlerFactory(ability: AppAbility, context: ExecutionContext) {
    return (handler: PolicyHandler) =>
      this.execPolicyHandler({ handler, ability, context });
  }

  public async checkPolicyAccess({
    requestUser,
    userId,
    action,
    subject,
    canParams,
  }: CheckPolicyAccessProps): Promise<boolean> {
    const ability = await this.createForRequestUser({
      requestUser,
      isMatchedUser: userId === requestUser.uuid,
    });

    if (canParams) {
      return canParams.reduce<boolean>(
        (permitted, canParam) =>
          permitted &&
          ability.can(canParam.action, canParam.subject, canParam.field),
        true
      );
    }

    return ability.can(action, subject);
  }

  public async canAccessOrFail({
    ForbiddenError = ForbiddenException,
    ...args
  }: CheckPolicyAccessProps & {
    ForbiddenError?: typeof ForbiddenException;
  }): Promise<void> {
    const hasAccess = await this.checkPolicyAccess(args);
    if (!hasAccess) {
      throw new ForbiddenError('Forbidden');
    }
  }
}

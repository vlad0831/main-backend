import { Injectable } from '@nestjs/common';
import { InvestmentPreferencesSettingsResponse } from './dto/investmentPreferencesSettings.response';
import { AssetClassService } from '../asset-class/assetClass.service';
import { InvestmentValueService } from '../investment-value/investmentValue.service';
import { RiskLevelService } from '../risk-level/riskLevel.service';
import { UserInvestmentPreferences } from './dto/userInvestmentPreferences';
import { NotFoundError } from '../shared/errors';
import { UserAssetClassService } from '../user-asset-class/userAssetClass.service';
import { UserInvestmentValueService } from '../investment-value/userInvestmentValue.service';
import { UserRiskLevelService } from '../risk-level/userRiskLevel.service';
import { SetUserInvestmentPreferencesArgs } from './dto/setUserInvestmentPreferences.args';
import { UserRiskLevel } from '../risk-level/entities/userRiskLevel.entity';
import { InvestmentValue } from '../investment-value/entities/investmentValue.entity';
import { AssetClass } from 'src/asset-class/entities/assetClass.entity';
import { UserInputError } from 'apollo-server-core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  USER_INVESTMENT_PREFERENCES_CHANGED,
  UserInvestmentPreferencesChangedEvent,
} from './events';
import { RiskLevel } from '../risk-level/entities/riskLevel.entity';
import { InvestmentQuestionnaire } from '../investment-questionnaire/entities/investmentQuestionnaire.entity';
import { InvestmentQuestionnaireOption } from '../investment-questionnaire/entities/investmentQuestionnaireOption.entity';

@Injectable()
export class InvestmentPreferencesService {
  public constructor(
    private readonly assetClassService: AssetClassService,
    private readonly investmentValueService: InvestmentValueService,
    private readonly riskLevelService: RiskLevelService,
    private readonly userAssetClassService: UserAssetClassService,
    private readonly userInvestmentValueService: UserInvestmentValueService,
    private readonly userRiskLevelService: UserRiskLevelService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async getInvestmentPreferencesSettings(): Promise<InvestmentPreferencesSettingsResponse> {
    const [investmentValueList, assetClassList, riskLevelList] =
      await Promise.all([
        this.investmentValueService.getList(),
        this.assetClassService.getAssetClassList(),
        this.riskLevelService.getList(),
      ]);

    return new InvestmentPreferencesSettingsResponse({
      investmentValueList,
      assetClassList,
      riskLevelList,
    });
  }

  public async getUserInvestmentPreferences(
    userId: string,
    predefined: {
      assetClassList?: AssetClass[];
      investmentValueList?: InvestmentValue[];
      userRiskLevel?: UserRiskLevel;
    } = {}
  ): Promise<UserInvestmentPreferences> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const [assetClassList, investmentValueList, userRiskLevel] =
      await Promise.all([
        predefined.assetClassList ||
          this.userAssetClassService.getUserAssetClassList(userId, false),
        predefined.investmentValueList ||
          this.userInvestmentValueService.getUserInvestmentValueList(userId),
        predefined.userRiskLevel ||
          this.userRiskLevelService.getUserRiskLevel(userId, false),
      ]);

    return new UserInvestmentPreferences({
      riskLevel: userRiskLevel?.riskLevel,
      assetClassList,
      investmentValueList,
    });
  }

  public async getUserDynamicInvestmentPreferences({
    userId,
    investmentValueIdList,
    assetClassIdList,
  }: {
    userId: string;
    investmentValueIdList?: string[];
    assetClassIdList?: string[];
  }): Promise<UserInvestmentPreferences> {
    const [assetClassList, investmentValueList] = await Promise.all([
      assetClassIdList && this.assetClassService.findByIdList(assetClassIdList),
      investmentValueIdList &&
        this.investmentValueService.findByIdList(investmentValueIdList),
    ]);

    return this.getUserInvestmentPreferences(userId, {
      assetClassList,
      investmentValueList,
    });
  }

  public async setUserInvestmentPreferences(
    userId: string,
    args: SetUserInvestmentPreferencesArgs
  ): Promise<UserInvestmentPreferences> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const { riskLevelId, investmentValueIdList, assetClassIdList } = args;

    if (!riskLevelId && !investmentValueIdList && !assetClassIdList) {
      throw new UserInputError('Investment preferences args missing');
    }

    let userRiskLevel: UserRiskLevel;
    let investmentValueList: InvestmentValue[];
    let assetClassList: AssetClass[];

    if (riskLevelId) {
      userRiskLevel = await this.userRiskLevelService.setUserRiskLevel(
        userId,
        args.riskLevelId
      );
    }

    if (investmentValueIdList) {
      investmentValueList =
        await this.userInvestmentValueService.setUserInvestmentValueList(
          userId,
          investmentValueIdList
        );
    }

    if (assetClassIdList) {
      assetClassList = await this.userAssetClassService.setUserAssetClassList(
        userId,
        assetClassIdList
      );
    }

    const userInvestmentPreferences = await this.getUserInvestmentPreferences(
      userId,
      { userRiskLevel, investmentValueList, assetClassList }
    );

    if (this.preferencesCollected(userInvestmentPreferences)) {
      await this.eventEmitter.emitAsync(
        USER_INVESTMENT_PREFERENCES_CHANGED,
        new UserInvestmentPreferencesChangedEvent({
          userId,
          ...userInvestmentPreferences,
        })
      );
    }

    return userInvestmentPreferences;
  }

  public async setPreferencesFromQuestionnaire({
    userId,
    investmentQuestionnaire,
    selectedOptionList,
  }: {
    userId: string;
    investmentQuestionnaire: InvestmentQuestionnaire;
    selectedOptionList: InvestmentQuestionnaireOption[];
  }) {
    if (
      !investmentQuestionnaire.isRiskLevelQuestion() &&
      !investmentQuestionnaire.isInvestmentValueQuestion()
    ) {
      return;
    }

    let userRiskLevel: UserRiskLevel;
    let investmentValueList: InvestmentValue[];

    if (investmentQuestionnaire.isRiskLevelQuestion()) {
      if (selectedOptionList && selectedOptionList.length > 0) {
        userRiskLevel = await this.userRiskLevelService.setUserRiskLevel(
          userId,
          selectedOptionList[0]
        );
      }
    } else if (investmentQuestionnaire.isInvestmentValueQuestion()) {
      investmentValueList =
        await this.userInvestmentValueService.setUserInvestmentValueList(
          userId,
          selectedOptionList
        );
    }

    const userInvestmentPreferences = await this.getUserInvestmentPreferences(
      userId,
      { userRiskLevel, investmentValueList }
    );

    if (this.preferencesCollected(userInvestmentPreferences)) {
      await this.eventEmitter.emitAsync(
        USER_INVESTMENT_PREFERENCES_CHANGED,
        new UserInvestmentPreferencesChangedEvent({
          userId,
          ...userInvestmentPreferences,
        })
      );
    }

    return userInvestmentPreferences;
  }

  public preferencesCollected({
    riskLevel,
    assetClassList,
  }: {
    riskLevel: RiskLevel;
    assetClassList: AssetClass[];
  }): boolean {
    return !!riskLevel && assetClassList?.length > 0;
  }
}

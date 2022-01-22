import { RiskLevel } from '../../risk-level/entities/riskLevel.entity';
import { InvestmentValue } from '../../investment-value/entities/investmentValue.entity';
import { AssetClass } from '../../asset-class/entities/assetClass.entity';

export const USER_INVESTMENT_PREFERENCES_CHANGED =
  'user_investment_preferences.changed';

export class UserInvestmentPreferencesChangedEvent {
  public readonly userId: string;
  public readonly riskLevel: RiskLevel;
  public readonly investmentValueList: InvestmentValue[];
  public readonly assetClassList: AssetClass[];

  public constructor(props: {
    userId: string;
    riskLevel: RiskLevel;
    investmentValueList: InvestmentValue[];
    assetClassList: AssetClass[];
  }) {
    this.userId = props.userId;
    this.riskLevel = props.riskLevel;
    this.investmentValueList = props.investmentValueList;
    this.assetClassList = props.assetClassList;
  }
}

import { Field, ObjectType } from '@nestjs/graphql';
import { RiskLevel } from '../../risk-level/entities/riskLevel.entity';
import { InvestmentValue } from '../../investment-value/entities/investmentValue.entity';
import { AssetClass } from '../../asset-class/entities/assetClass.entity';

@ObjectType()
export class InvestmentPreferencesSettingsResponse {
  @Field(() => [RiskLevel])
  riskLevelList: RiskLevel[];

  @Field(() => [InvestmentValue])
  investmentValueList: InvestmentValue[];

  @Field(() => [AssetClass])
  assetClassList: AssetClass[];

  public constructor(props: {
    investmentValueList: InvestmentValue[];
    assetClassList: AssetClass[];
    riskLevelList: RiskLevel[];
  }) {
    this.riskLevelList = props.riskLevelList;
    this.investmentValueList = props.investmentValueList;
    this.assetClassList = props.assetClassList;
  }
}

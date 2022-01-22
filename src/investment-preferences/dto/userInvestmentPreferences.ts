import { Field, ObjectType } from '@nestjs/graphql';
import { RiskLevel } from '../../risk-level/entities/riskLevel.entity';
import { InvestmentValue } from '../../investment-value/entities/investmentValue.entity';
import { AssetClass } from '../../asset-class/entities/assetClass.entity';

@ObjectType()
export class UserInvestmentPreferences {
  @Field(() => RiskLevel, { nullable: true })
  riskLevel: RiskLevel;

  @Field(() => [InvestmentValue])
  investmentValueList: InvestmentValue[];

  @Field(() => [AssetClass])
  assetClassList: AssetClass[];

  public constructor(props: {
    riskLevel?: RiskLevel;
    investmentValueList: InvestmentValue[];
    assetClassList: AssetClass[];
  }) {
    this.riskLevel = props.riskLevel;
    this.investmentValueList = props.investmentValueList;
    this.assetClassList = props.assetClassList;
  }
}

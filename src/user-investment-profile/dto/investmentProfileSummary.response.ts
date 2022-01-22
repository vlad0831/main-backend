import { Field, ObjectType } from '@nestjs/graphql';
import { AccountSummary } from '../../drivewealth/types';

@ObjectType()
class InvestmentCashInfo {
  @Field()
  cashAvailableForTrade: number;

  @Field()
  cashAvailableForWithdrawal: number;

  @Field()
  cashBalance: number;

  public constructor(props: {
    cashAvailableForTrade: number;
    cashAvailableForWithdrawal: number;
    cashBalance: number;
  }) {
    this.cashAvailableForTrade = props.cashAvailableForTrade;
    this.cashAvailableForWithdrawal = props.cashAvailableForWithdrawal;
    this.cashBalance = props.cashBalance;
  }
}

@ObjectType()
class InvestmentEquityPosition {
  @Field()
  symbol: string;

  @Field()
  marketValue: number;

  @Field()
  side: string;

  public constructor(props: {
    symbol: string;
    marketValue: number;
    side: string;
  }) {
    this.symbol = props.symbol;
    this.marketValue = props.marketValue;
    this.side = props.side;
  }
}

@ObjectType()
export class InvestmentProfileSummaryResponse {
  @Field(() => InvestmentCashInfo)
  cash: InvestmentCashInfo;

  @Field()
  equityValue: number;

  @Field(() => [InvestmentEquityPosition])
  equityPositions: InvestmentEquityPosition[];

  public constructor({ accountSummary }: AccountSummary) {
    this.cash = new InvestmentCashInfo(accountSummary.cash);
    this.equityValue = accountSummary.equity.equityValue;
    this.equityPositions = accountSummary.equity.equityPositions.map(
      (position) => new InvestmentEquityPosition(position)
    );
  }
}

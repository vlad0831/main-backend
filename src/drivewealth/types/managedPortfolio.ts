export interface FundSettings {
  name: string;
  clientFundId: string;
  description: string;
  holdings: {
    instrumentId: string;
    target: number;
  }[];
}

export interface Fund {
  id: string;
  userID: string;
  name: string;
  type: 'FUND';
  clientFundID: string;
  description: string;
  holdings: { instrumentID: string; target: number }[];
  triggers?: [
    {
      child: null | string;
      maxAllowed: null | number;
      lowerBound: null | number;
      upperBound: null | number;
      type: 'TOTAL_DRIFT';
    },
    {
      child: null | string;
      maxAllowed: null | number;
      lowerBound: null | number;
      upperBound: null | number;
      type: 'ABSOLUTE_DRIFT';
    },
    {
      child: null | string;
      maxAllowed: null | number;
      lowerBound: null | number;
      upperBound: null | number;
      type: 'RELATIVE_DRIFT';
    }
  ];
  isInstrumentTargetsChanged: boolean;
  instrumentTargetsChanged: boolean;
}

export interface PortfolioHoldings {
  fundId: string;
  target: number;
}

export interface PortfolioSettings {
  name: string;
  clientPortfolioID: string;
  description: string;
  holdings: PortfolioHoldings[];
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  clientPortfolioID: string;
  holdings: [
    {
      id: string;
      name: string;
      type: 'FUND';
      clientFundID: string;
      description: string;
      target: number;
      holdings: { instrumentID: string; target: number }[];
      triggers: [
        {
          child: null | string;
          maxAllowed: null | number;
          lowerBound: null | number;
          upperBound: null | number;
          type: 'TOTAL_DRIFT';
        },
        {
          child: null | string;
          maxAllowed: null | number;
          lowerBound: null | number;
          upperBound: null | number;
          type: 'ABSOLUTE_DRIFT';
        },
        {
          child: null | string;
          maxAllowed: null | number;
          lowerBound: null | number;
          upperBound: null | number;
          type: 'RELATIVE_DRIFT';
        }
      ];
    },
    {
      type: 'CASH_RESERVE';
      target: number;
    }
  ];
  userID: string;
  triggers: [
    {
      child: null | string;
      maxAllowed: null | number;
      lowerBound: null | number;
      upperBound: null | number;
      type: 'TOTAL_DRIFT';
    },
    {
      child: null | string;
      maxAllowed: null | number;
      lowerBound: null | number;
      upperBound: null | number;
      type: 'ABSOLUTE_DRIFT';
    },
    {
      child: null | string;
      maxAllowed: null | number;
      lowerBound: null | number;
      upperBound: null | number;
      type: 'RELATIVE_DRIFT';
    }
  ];
  isFundTargetsChanged: boolean;
  fundTargetsChanged: boolean;
}

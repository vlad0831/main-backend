export interface ManagedAccount {
  id: string;
  accountNo: string;
  accountType: {
    name: 'LIVE';
    description: string;
  };
  accountMgmtType: {
    name: 'RIA_MANAGED';
    description: string;
  };
  status: {
    name: 'OPEN';
    description: string;
  };
  tradingType: {
    name: 'CASH';
    description: string;
  };
  leverage: number;
  nickname: string;
  parentIB: {
    id: string;
    name: string;
  };
  commissionID: string;
  beneficiaries: boolean;
  userID: string;
  restricted: boolean;
  goodFaithViolations: number;
  patternDayTrades: number;
  freeTradeBalance: number;
  gfvPdtExempt: boolean;
  buyingPowerOverride: boolean;
  bod: {};
  ria: {
    advisorID: string;
    productID: string;
    portfolioID: string;
  };
  sweepInd: boolean;
  interestFree: boolean;
  openedWhen: string;
  ignoreMarketHoursForTest: boolean;
  flaggedForACATS: boolean;
}

export interface AccountSummary {
  accountSummary: {
    accountID: string;
    accountNo: string;
    tradingType: 'CASH';
    lastUpdated: string;
    cash: {
      cashAvailableForTrade: number;
      cashAvailableForWithdrawal: number;
      cashBalance: number;
      cashSettlement: {
        utcTime: string;
        cash: number;
      }[];
      pendingPaymentsAmount: number;
    };
    equity: {
      equityValue: number;
      equityPositions: {
        symbol: string;
        instrumentID: string;
        openQty: number;
        costBasis: number;
        marketValue: number;
        side: 'B' | 'S';
        priorClose: number;
        availableForTradingQty: number;
        avgPrice: number;
        mktPrice: number;
        unrealizedPL: number;
        unrealizedDayPLPercent: number;
        unrealizedDayPL: number;
      }[];
    };
    orders: {
      orderID: string;
      orderNo: string;
      createdWhen: string;
      symbol: string;
      cumQty: number;
      orderStatus: string;
      orderType: string;
      orderQty: number;
      isoTimeRestingOrderExpires: string | null;
      limitPrice: number;
      side: 'B' | 'S';
      orderCashAmt: number;
      stopPrice: number;
    }[];
    transactions: {
      orderId: string;
      orderNo: string;
      symbol: string;
      cumQty: number;
      orderStatus: string;
      orderType: string;
      orderQty: number;
      limitPrice: number;
      stopPrice: number;
      executedPrice: number;
      side: 'B' | 'S';
      createdWhen: string;
      updatedWhen: string;
      updatedReason: string;
      commission: number;
      commissionDesc: string | null;
      isoTimeRestingOrderExpires: string | null;
      executedWhen: string;
      realizedPL: number | null;
      orderCashAmt: number;
    }[];
  };
}

export interface AccountPerformance {
  accountID: string;
  accountNo: string;
  startDate: string;
  endDate: string;
  lastUpdated: string;
  performance: AccountPerformanceItem[];
}

export interface AccountPerformanceItem {
  realizedDayPL: number;
  unrealizedDayPL: number;
  cumRealizedPL: number;
  date: string;
  equity: number;
  cash: number;
  deposits: number;
  withdrawals: number;
  fees: number;
}

export interface AccountPerformanceFilter {
  monthPeriod?: number;
  weekPeriod?: number;
  dayPeriod?: number;
}

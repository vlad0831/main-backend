type InstrumentType =
  | 'EQUITY'
  | 'ETF'
  | 'ALTERNATIVE_ASSET'
  | 'ADR'
  | 'ETN'
  | 'MUTUAL_FUND'
  | 'CYBER_SECURITY'
  | 'METALS';
type InstrumentStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSE_ONLY';

export interface Instrument {
  symbol: string;
  name: string;
  id: string;
  type: InstrumentType;
  status: InstrumentStatus;
  ISIN: string;
}

export interface InstrumentFundamentals extends Instrument {
  reutersPrimaryRic: string;
  description: string;
  sector: string;
  longOnly: boolean;
  orderSizeMax: number;
  orderSizeMin: number;
  orderSizeStep: number;
  exchangeNickelSpread: boolean;
  close: number;
  descriptionChinese: string;
  fundamentalDataModel: {
    instrumentID: string;
    symbol: string;
    openPrice: number;
    bidPrice: number;
    askPrice: number;
    lowPrice: number;
    highPrice: number;
    fiftyTwoWeekLowPrice: number;
    fiftyTwoWeekHighPrice: number;
    cumulativeVolume: number;
    marketCap: number;
    peRatio: number;
    dividendYield: number;
    earningsPerShare: number;
    dividend: number;
    sharesOutstanding: number;
    timeLastUpdate: string;
    bookValuePerShare: string;
    cashFlowPerShare: string;
    operatingIncome: string;
    pbRatio: string;
    volumeMovingAverage10Day: number;
    volumeMovingAverage25Day: number;
    volumeMovingAverage50Day: number;
    priceMovingAverage50Day: number;
    priceMovingAverage150Day: number;
    priceMovingAverage200Day: number;
    roe: string;
  };
  exchange: string;
  url: string;
  closePrior: number;
  image: string;
}

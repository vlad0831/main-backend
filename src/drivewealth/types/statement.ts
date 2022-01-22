export interface Statement {
  displayName: string;
  fileKey: string;
}

export type StatementType =
  | 'AccountStatement'
  | 'TaxDocument'
  | 'TradeConfirmation';

export interface StatementProps {
  accountId: string;
  type: StatementType;
  from: string;
  to: string;
}

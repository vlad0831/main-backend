export const USER_MANAGED_PORTFOLIO_CHANGED = 'user_managed_portfolio.changed';

export class UserManagedPortfolioChangedEvent {
  public readonly userId: string;
  public readonly allioPortfolioId: string;
  public readonly assets: string[];
  public readonly weights: number[];

  constructor(props: {
    userId: string;
    allioPortfolioId: string;
    assets: string[];
    weights: number[];
  }) {
    this.userId = props.userId;
    this.allioPortfolioId = props.allioPortfolioId;
    this.assets = props.assets;
    this.weights = props.weights;
  }
}

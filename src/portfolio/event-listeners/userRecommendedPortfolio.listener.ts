import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  USER_INVESTMENT_PREFERENCES_CHANGED,
  UserInvestmentPreferencesChangedEvent,
} from '../../investment-preferences/events';
import { UserRecommendedPortfolioService } from '../userRecommendedPortfolio.service';

@Injectable()
export class UserRecommendedPortfolioListener {
  public constructor(
    private readonly userRecommendedPortfolioService: UserRecommendedPortfolioService
  ) {}

  @OnEvent(USER_INVESTMENT_PREFERENCES_CHANGED)
  public handleInvestmentPreferencesChangedEvent(
    payload: UserInvestmentPreferencesChangedEvent
  ) {
    return this.userRecommendedPortfolioService.setRecommendedPortfolio(
      payload
    );
  }
}

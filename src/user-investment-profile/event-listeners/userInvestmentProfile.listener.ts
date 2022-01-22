import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  USER_MANAGED_PORTFOLIO_CHANGED,
  UserManagedPortfolioChangedEvent,
} from '../../portfolio/events';
import { UserInvestmentProfileService } from '../userInvestmentProfile.service';

@Injectable()
export class UserInvestmentProfileListener {
  public constructor(
    private readonly userInvestmentProfileService: UserInvestmentProfileService
  ) {}

  @OnEvent(USER_MANAGED_PORTFOLIO_CHANGED)
  public async handleManagedPortfolioChangedEvent(
    payload: UserManagedPortfolioChangedEvent
  ): Promise<void> {
    await this.userInvestmentProfileService.actualizeManagedInvestmentProfile(
      payload
    );
  }
}

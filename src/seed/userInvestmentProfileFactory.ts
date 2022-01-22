import { Injectable } from '@nestjs/common';
import { UserInvestmentProfileService } from '../user-investment-profile/userInvestmentProfile.service';
import { SeedConfig } from './seed.config';
import { UserInvestmentProfile } from '../user-investment-profile/entities/userInvestmentProfile.entity';
import { ManagedPortfolioService } from '../managed-portfolio/managedPortfolio.service';

@Injectable()
export class UserInvestmentProfileFactory {
  public constructor(
    private readonly userInvestmentProfileService: UserInvestmentProfileService,
    private readonly managedPortfolioService: ManagedPortfolioService,
    private readonly seedConfig: SeedConfig
  ) {}

  public async create(): Promise<UserInvestmentProfile> {
    const userId = this.seedConfig.getUserId();

    const userInvestmentProfile =
      await this.userInvestmentProfileService.getByUserId(userId);

    if (!userInvestmentProfile) {
      const managedPortfolio = await this.managedPortfolioService.findOneOrFail(
        { active: true }
      );
      return await this.userInvestmentProfileService.createProfile(
        userId,
        managedPortfolio.driveWealthPortfolioId
      );
    }

    return userInvestmentProfile;
  }
}

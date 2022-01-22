import { BaseService } from '../shared/base.service';
import { UserInvestmentProfile } from './entities/userInvestmentProfile.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { DriveWealthService } from '../drivewealth/drivewealth.service';
import { ManagedPortfolioService } from '../managed-portfolio/managedPortfolio.service';
import { ManagedPortfolio } from '../managed-portfolio/entities/managedPortfolio.entity';
import { InvestmentProfileSummaryResponse } from './dto/investmentProfileSummary.response';
import { NotFoundError } from '../shared/errors';
import { GetUserInvestmentPerformanceArgs } from './dto/getUserInvestmentPerformance.args';
import { InvestmentPerformanceItemResponse } from './dto/investmentPerformanceItem.response';
import {
  AccountPerformance,
  AccountSummary,
  ManagedAccount,
  User,
} from '../drivewealth/types';

@Injectable()
export class UserInvestmentProfileService extends BaseService<UserInvestmentProfile> {
  protected logger: Logger;

  public constructor(
    @InjectRepository(UserInvestmentProfile)
    private readonly userInvestmentProfileRepo: EntityRepository<UserInvestmentProfile>,
    private readonly driveWealthService: DriveWealthService,
    private readonly managedPortfolioService: ManagedPortfolioService
  ) {
    super(userInvestmentProfileRepo);
    this.logger = new Logger(UserInvestmentProfileService.name);
  }

  public getByUserId(userId: string): Promise<UserInvestmentProfile> {
    return this.findOne({ userId });
  }

  public async actualizeManagedInvestmentProfile({
    userId,
    allioPortfolioId,
    assets,
    weights,
  }: {
    userId: string;
    allioPortfolioId: string;
    assets: string[];
    weights: number[];
  }): Promise<UserInvestmentProfile> {
    const managedPortfolio: ManagedPortfolio =
      await this.managedPortfolioService.findOrCreate({
        allioPortfolioId,
        assets,
        weights,
      });

    const userInvestmentProfile: UserInvestmentProfile = await this.getByUserId(
      userId
    );

    if (!userInvestmentProfile) {
      return await this.createProfile(
        userId,
        managedPortfolio.driveWealthPortfolioId
      );
    }

    return await this.changeManagedPortfolio(
      userInvestmentProfile,
      managedPortfolio.driveWealthPortfolioId
    );
  }

  public async createProfile(
    userId: string,
    driveWealthPortfolioId: string
  ): Promise<UserInvestmentProfile> {
    // TODO remove hardcoded value
    const dwUser: User = await this.driveWealthService.createUser({
      firstName: 'John',
      lastName: 'Doe',
      phone: '2912341122',
      emailAddress: 'bc@b.com',
      socialSecurityNumber: '123456789',
      citizenship: 'USA',
      usTaxPayer: true,
      birthDay: 3,
      birthMonth: 12,
      birthYear: 1990,
      street1: '123 Main St',
      city: 'Chatham',
      province: 'NJ',
      postalCode: '09812',
      country: 'USA',
    });
    const dwManagedAccount: ManagedAccount =
      await this.driveWealthService.createManagedAccount(
        dwUser.id,
        driveWealthPortfolioId
      );

    const userInvestmentProfile: UserInvestmentProfile = this.create({
      userId,
      driveWealthUserId: dwUser.id,
      accountId: dwManagedAccount.id,
      accountNo: dwManagedAccount.accountNo,
      portfolioId: driveWealthPortfolioId,
    });

    await this.persistAndFlush(userInvestmentProfile);

    return userInvestmentProfile;
  }

  private async changeManagedPortfolio(
    userInvestmentProfile: UserInvestmentProfile,
    newDriveWealthPortfolioId: string
  ): Promise<UserInvestmentProfile> {
    if (userInvestmentProfile.portfolioId === newDriveWealthPortfolioId) {
      return userInvestmentProfile;
    }

    await this.driveWealthService.changeManagedAccountPortfolio(
      userInvestmentProfile.accountId,
      newDriveWealthPortfolioId
    );

    userInvestmentProfile.portfolioId = newDriveWealthPortfolioId;
    await this.persistAndFlush(userInvestmentProfile);

    return userInvestmentProfile;
  }

  public async getUserInvestmentProfileSummary(
    userId: string
  ): Promise<InvestmentProfileSummaryResponse | undefined> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const userInvestmentProfile: UserInvestmentProfile = await this.getByUserId(
      userId
    );

    if (!userInvestmentProfile) {
      return;
    }

    const dwAccountSummary: AccountSummary =
      await this.driveWealthService.getAccountSummary(
        userInvestmentProfile.accountId
      );

    return new InvestmentProfileSummaryResponse(dwAccountSummary);
  }

  public async getUserInvestmentPerformance(
    userId: string,
    args: GetUserInvestmentPerformanceArgs
  ): Promise<InvestmentPerformanceItemResponse[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const userInvestmentProfile: UserInvestmentProfile = await this.getByUserId(
      userId
    );

    if (!userInvestmentProfile) {
      return [];
    }

    const dwAccountPerformance: AccountPerformance =
      await this.driveWealthService.getAccountPerformance(
        userInvestmentProfile.accountId,
        args
      );

    return dwAccountPerformance.performance.map(
      (item) => new InvestmentPerformanceItemResponse(item)
    );
  }
}

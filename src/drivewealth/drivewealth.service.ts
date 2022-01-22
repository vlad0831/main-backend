import { Injectable, Logger } from '@nestjs/common';
import { DriveWealthApi } from './drivewealth';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { BadRequestError } from '../shared/errors';
import {
  AccountPerformance,
  AccountPerformanceFilter,
  AccountSummary,
  BankAccount,
  DWError,
  Fund,
  FundSettings,
  Instrument,
  ManagedAccount,
  Portfolio,
  PortfolioHoldings,
  PortfolioSettings,
  ProcessorTokenSettings,
  Statement,
  StatementProps,
  User,
  UserSettings,
} from './types';

@Injectable()
export class DriveWealthService {
  private readonly driveWealthApi: DriveWealthApi;
  private readonly logger: Logger;

  public constructor(private configService: ConfigService) {
    this.driveWealthApi = new DriveWealthApi({
      clientAppKey: this.configService.get('DW_APP_KEY'),
      username: this.configService.get('DW_USERNAME'),
      password: this.configService.get('DW_PASSWORD'),
      backOfficeUrl: this.configService.get('DW_HOST_URL'),
      wlpId: this.configService.get('DW_WLP_ID'),
      riaId: this.configService.get('DW_RIA_ID'),
      riaProductId: this.configService.get('DW_RIA_PRODUCT_ID'),
    });
    this.logger = new Logger(DriveWealthService.name);
    this.catchError = this.catchError.bind(this);
  }

  private catchError<T>(err: AxiosError | Error): T {
    const axiosErr: AxiosError = err as AxiosError;
    if (axiosErr.isAxiosError) {
      const dwErrorData: DWError = axiosErr.response?.data;
      this.logger.error(dwErrorData);
      throw new BadRequestError('DriveWealth error', dwErrorData);
    }

    this.logger.error(`Unknown DriveWealth error - ${err.message}`);
    throw new BadRequestError(`Unknown DriveWealth error - ${err.message}`);
  }

  public createFund(fundSettings: FundSettings): Promise<Fund> {
    return this.driveWealthApi
      .createFund(fundSettings)
      .catch<Fund>(this.catchError);
  }

  public getFunds(): Promise<Fund[]> {
    return this.driveWealthApi.getFunds().catch<Fund[]>(this.catchError);
  }

  public listInstruments(): Promise<Instrument[]> {
    return this.driveWealthApi
      .listInstruments()
      .catch<Instrument[]>(this.catchError);
  }

  public createUser(userSettings: UserSettings): Promise<User> {
    return this.driveWealthApi
      .createUser(userSettings)
      .catch<User>(this.catchError);
  }

  public createManagedAccount(
    userId: string,
    portfolioId: string
  ): Promise<ManagedAccount> {
    return this.driveWealthApi
      .createManagedAccount(userId, portfolioId)
      .catch<ManagedAccount>(this.catchError);
  }

  public changeManagedAccountPortfolio(
    accountId: string,
    portfolioId: string
  ): Promise<ManagedAccount> {
    return this.driveWealthApi
      .changeManagedAccountPortfolio(accountId, portfolioId)
      .catch<ManagedAccount>(this.catchError);
  }

  public createManagedPortfolio(
    portfolio: PortfolioSettings
  ): Promise<Portfolio> {
    return this.driveWealthApi
      .createManagedPortfolio(portfolio)
      .catch<Portfolio>(this.catchError);
  }

  public updateManagedPortfolio(
    portfolioId: string,
    holdings: PortfolioHoldings[]
  ): Promise<Portfolio> {
    return this.driveWealthApi
      .updatePortfolio(portfolioId, holdings)
      .catch<Portfolio>(this.catchError);
  }

  public getAccountSummary(accountId: string): Promise<AccountSummary> {
    return this.driveWealthApi
      .getAccountSummary(accountId)
      .catch<AccountSummary>(this.catchError);
  }

  public getAccountPerformance(
    accountId: string,
    filter?: AccountPerformanceFilter
  ): Promise<AccountPerformance> {
    return this.driveWealthApi
      .getAccountPerformance(accountId, filter)
      .catch<AccountPerformance>(this.catchError);
  }

  public createBankAccountViaPlaid(
    processorToken: ProcessorTokenSettings
  ): Promise<BankAccount> {
    return this.driveWealthApi
      .createBankAccountViaPlaid(processorToken)
      .catch(this.catchError) as Promise<BankAccount>;
  }

  public deleteBankAccount(bankAccountId: string): Promise<void> {
    return this.driveWealthApi
      .deleteBankAccount(bankAccountId)
      .catch<void>(this.catchError);
  }

  public getStatements(props: StatementProps): Promise<Statement[]> {
    return this.driveWealthApi
      .getStatements(props)
      .catch<Statement[]>(this.catchError);
  }
}

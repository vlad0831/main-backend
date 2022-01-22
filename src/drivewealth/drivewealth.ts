import type { AxiosInstance } from 'axios';
import axios from 'axios';
import {
  AccountPerformance,
  AccountPerformanceFilter,
  AccountSummary,
  BankAccount,
  BankAccountSettings,
  Configuration,
  Country,
  Fund,
  FundSettings,
  Instrument,
  InstrumentFundamentals,
  ManagedAccount,
  Portfolio,
  PortfolioHoldings,
  PortfolioSettings,
  ProcessorTokenSettings,
  Statement,
  StatementProps,
  StatementType,
  User,
  UserBankAccount,
  UserDetails,
  UserSettings,
} from './types';

export class DriveWealthApi {
  private readonly clientAppKey: string;
  private readonly username: string;
  private readonly password: string;
  private readonly backOfficeUrl: string;
  private readonly wlpId: string;
  private readonly riaId: string;
  private readonly riaProductId: string;
  private readonly axiosInstance: AxiosInstance;
  private readonly partnerId: string;
  private sessionKey: string;
  private userId: string;

  private readonly performancePeriodUnitMap = {
    monthPeriod: 'm',
    weekPeriod: 'w',
    dayPeriod: 'd',
  };

  private readonly statementPathMap: Record<StatementType, string> = {
    AccountStatement: 'statements',
    TaxDocument: 'taxforms',
    TradeConfirmation: 'confirms',
  };

  constructor(configuration: Configuration) {
    this.clientAppKey = configuration.clientAppKey;
    this.username = configuration.username;
    this.password = configuration.password;
    this.backOfficeUrl = configuration.backOfficeUrl;
    this.wlpId = configuration.wlpId;
    this.riaId = configuration.riaId;
    this.partnerId = this.riaId;
    this.riaProductId = configuration.riaProductId;
    this.axiosInstance = axios.create({
      baseURL: this.backOfficeUrl,
      headers: {
        'Content-Type': 'application/json',
        'dw-client-app-key': this.clientAppKey,
        'dw-auth-token': '',
      },
    });
    this.setupClient();
  }

  private async refreshSessionKey() {
    const url = `${this.backOfficeUrl}/auth`;
    const headers = { 'dw-client-app-key': this.clientAppKey };
    const body = {
      username: this.username,
      password: this.password,
      ip_address: '1.1.1.1',
      languageID: 'en_US',
      osVersion: 'unknown',
      osType: 'unknown',
      scrRes: '1212x1216',
      appVersion: '1.0.0',
      appTypeID: 4,
    };

    const { data } = await axios.post(url, body, { headers });

    this.sessionKey = data.authToken;
    this.userId = data.userID;
  }

  private setupClient() {
    const interceptor = this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status !== 401) {
          throw error;
        }

        axios.interceptors.response.eject(interceptor);

        try {
          await this.refreshSessionKey();

          error.response.config.headers['dw-auth-token'] = this.sessionKey;

          return axios(error.response.config);
        } finally {
          this.setupClient();
        }
      }
    );
  }

  public async listInstruments(): Promise<Instrument[]> {
    const url = '/instruments/?status=ACTIVE';

    const { data } = await this.axiosInstance.get<Instrument[]>(url);

    return data;
  }

  public async getInstrumentFundamentals(
    instrumentId: string
  ): Promise<InstrumentFundamentals[]> {
    const url = `/instruments/${instrumentId}?options=Fundamentals`;

    const { data } = await this.axiosInstance.get<InstrumentFundamentals[]>(
      url
    );

    return data;
  }

  public async listCountries(): Promise<Country[]> {
    const url = '/countries?status=active';

    const { data } = await this.axiosInstance.get<Country[]>(url);

    return data;
  }

  public async createFund(fund: FundSettings): Promise<Fund> {
    const url = '/managed/funds';
    const body = {
      userID: this.riaId,
      name: fund.name,
      clientFundID: fund.clientFundId,
      description: fund.description,
      holdings: fund.holdings.map((holding) => ({
        instrumentID: holding.instrumentId,
        target: holding.target,
      })),
      triggers: [
        {
          type: 'TOTAL_DRIFT',
          maxAllowed: 0.05,
        },
        {
          type: 'RELATIVE_DRIFT',
          child: null,
          lowerBound: 0.02,
          upperBound: null,
        },
        {
          type: 'ABSOLUTE_DRIFT',
          child: null,
          lowerBound: null,
          upperBound: 0.01,
        },
      ],
    };

    const { data } = await this.axiosInstance.post<Fund>(url, body);

    return data;
  }

  public async getFund(fundId: string): Promise<Fund> {
    const url = `/managed/funds/${fundId}`;

    const { data } = await this.axiosInstance.get<Fund>(url);

    return data;
  }

  public async getFunds(): Promise<Fund[]> {
    const url = `/users/${this.riaId}/managed/funds`;

    const { data } = await this.axiosInstance.get<Fund[]>(url);

    return data;
  }

  public async createManagedPortfolio(
    portfolio: PortfolioSettings
  ): Promise<Portfolio> {
    const url = '/managed/portfolios';
    const body = {
      userID: this.riaId,
      name: portfolio.name,
      clientPortfolioID: portfolio.clientPortfolioID,
      description: portfolio.description,
      holdings: portfolio.holdings.map((holding) => ({
        id: holding.fundId,
        target: holding.target,
      })),
      triggers: [
        {
          type: 'TOTAL_DRIFT',
          maxAllowed: 0.05,
        },
        {
          type: 'RELATIVE_DRIFT',
          child: null,
          lowerBound: 0.02,
          upperBound: null,
        },
      ],
    };

    const { data } = await this.axiosInstance.post<Portfolio>(url, body);

    return data;
  }

  public async updatePortfolio(
    portfolioId: string,
    holdings: PortfolioHoldings[]
  ): Promise<Portfolio> {
    const url = `/managed/portfolios/${portfolioId}`;
    const body = {
      holdings: holdings.map((holding) => ({
        id: holding.fundId,
        target: holding.target,
      })),
    };
    const { data } = await this.axiosInstance.patch<Portfolio>(url, body);

    return data;
  }

  public async getPortfolio(portfolioId: string): Promise<Portfolio> {
    const url = `/managed/portfolios/${portfolioId}`;

    const { data } = await this.axiosInstance.get<Portfolio>(url);

    return data;
  }

  public async createUser(account: UserSettings): Promise<User> {
    const url = '/users/';
    const body = {
      userType: 'INDIVIDUAL_TRADER',
      wlpID: this.wlpId,
      parentIBID: this.partnerId,
      documents: [
        {
          type: 'BASIC_INFO',
          data: {
            firstName: account.firstName,
            lastName: account.lastName,
            phone: account.phone,
            emailAddress: account.emailAddress,
            country: 'USA',
            language: 'en_US',
          },
        },
        {
          type: 'IDENTIFICATION_INFO',
          data: {
            value: account.socialSecurityNumber,
            type: 'SSN',
            citizenship: account.citizenship,
            usTaxPayer: account.usTaxPayer,
          },
        },
        {
          type: 'PERSONAL_INFO',
          data: {
            birthDay: account.birthDay,
            birthMonth: account.birthMonth,
            birthYear: account.birthYear,
            politicallyExposedNames: null, // TODO
          },
        },
        {
          type: 'ADDRESS_INFO',
          data: {
            street1: account.street1,
            city: account.city,
            province: account.province,
            postalCode: account.postalCode,
            country: account.country,
          },
        },
        {
          type: 'EMPLOYMENT_INFO',
          data: {
            status: 'Employed',
            broker: false, // TODO.
            directorOf: null, // TODO.
            company: 'MyCo',
            type: 'TRANSPORT',
            position: 'CASHIER',
          },
        },
        {
          type: 'INVESTOR_PROFILE_INFO',
          data: {
            investmentExperience: 'NONE',
            riskTolerance: 'Low', // TODO MAYBE?
            investmentObjectives: 'ACTIVE_DAILY',
            annualIncome: 10000,
            networthLiquid: -1, // TODO MAYBE?
            networthTotal: -1, // TODO MAYBE?
          },
        },
        {
          type: 'DISCLOSURES',
          data: {
            termsOfUse: true,
            customerAgreement: true,
            marketDataAgreement: true,
            rule14b: true,
            findersFee: false,
            privacyPolicy: true,
            dataSharing: true,
            signedBy: `${account.firstName} ${account.lastName}`,
          },
        },
      ],
    };

    const { data } = await this.axiosInstance.post<User>(url, body);

    return data;
  }

  public async getUserDetails(userId: string): Promise<UserDetails> {
    const url = `/users/${userId}`;

    const { data } = await this.axiosInstance.get<UserDetails>(url);

    return data;
  }

  public async createManagedAccount(
    userId: string,
    portfolioId: string
  ): Promise<ManagedAccount> {
    const url = '/accounts';
    const body = {
      userID: userId,
      accountType: 'LIVE',
      accountManagementType: 'RIA_MANAGED',
      tradingType: 'CASH',
      riaUserID: this.riaId,
      riaProductID: this.riaProductId,
      riaPortfolioID: portfolioId,
    };

    const { data } = await this.axiosInstance.post<ManagedAccount>(url, body);

    return data;
  }

  public async changeManagedAccountPortfolio(
    accountId: string,
    portfolioID: string
  ): Promise<ManagedAccount> {
    const url = `accounts/${accountId}`;
    const body = {
      ria: {
        portfolioID,
      },
    };
    const { data } = await this.axiosInstance.patch<ManagedAccount>(url, body);

    return data;
  }

  public async createBankAccount(
    bank: BankAccountSettings
  ): Promise<BankAccount> {
    const url = '/bank-accounts';
    const body = {
      plaidPublicToken: bank.plaidPublicToken,
      userID: bank.userId,
      bankAccountNumber: bank.bankAccountNumber,
      bankRoutingNumber: bank.bankRoutingNumber,
      bankAccountNickname: bank.bankAccountNickname,
    };

    const { data } = await this.axiosInstance.post<BankAccount>(url, body);

    return data;
  }

  public async createBankAccountViaPlaid(
    processorToken: ProcessorTokenSettings
  ): Promise<BankAccount> {
    const url = '/bank-accounts';
    const body = {
      plaidProcessorToken: processorToken.processorToken,
      userID: processorToken.userId,
      bankAccountNickname: processorToken.bankAccountNickname,
    };

    const { data } = await this.axiosInstance.post<BankAccount>(url, body);

    return data;
  }

  public async deleteBankAccount(bankAccountId: string): Promise<void> {
    const url = `/bank-accounts/${bankAccountId}`;
    await this.axiosInstance.delete<void>(url);
    return;
  }

  public async getBankAccounts(userId: string): Promise<UserBankAccount[]> {
    const url = `/users/${userId}/bank-accounts`;

    const { data } = await this.axiosInstance.get<UserBankAccount[]>(url);

    return data;
  }

  public async getAccountSummary(accountId: string): Promise<AccountSummary> {
    const url = `/accounts/${accountId}/summary`;

    const { data } = await this.axiosInstance.get<AccountSummary>(url);

    return data;
  }

  public async getAccountPerformance(
    accountId: string,
    filter: AccountPerformanceFilter = {}
  ): Promise<AccountPerformance> {
    const url = `/accounts/${accountId}/performance`;
    const entry = Object.entries(filter)[0];
    const unit = entry && this.performancePeriodUnitMap[entry[0]];
    const params: { period?: string } = {};
    if (unit) {
      params.period = `${entry[1]}${unit}`;
    }

    const { data } = await this.axiosInstance.get<AccountPerformance>(url, {
      params,
    });

    return data;
  }

  public async getStatements({
    accountId,
    type,
    from,
    to,
  }: StatementProps): Promise<Statement[]> {
    const path = this.statementPathMap[type];
    if (!path) {
      throw new Error('Unrecognized statement type');
    }
    const url = `/accounts/${accountId}/${path}`;
    const params = { from, to };

    const { data } = await this.axiosInstance.get<Statement[]>(url, {
      params,
    });

    return data;
  }
}

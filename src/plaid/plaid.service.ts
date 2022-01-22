import {
  AccountBase,
  Configuration,
  CountryCode,
  Institution,
  ItemPublicTokenExchangeResponse,
  ItemRemoveRequest,
  ItemRemoveResponse,
  LinkTokenCreateResponse,
  PlaidApi,
  PlaidEnvironments,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  ProcessorTokenCreateResponse,
  Products,
  Transaction,
  ModelError,
} from 'plaid';
import { BadRequestError, NotFoundError } from '../shared/errors';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { ApolloError } from 'apollo-server-core';

@Injectable()
export class PlaidService {
  private readonly client: PlaidApi;
  private readonly products: Products[];
  private readonly countryCodes: CountryCode[];
  private readonly logger: Logger;

  constructor(private readonly configService: ConfigService) {
    const headers = {
      'PLAID-CLIENT-ID': this.configService.get('PLAID_CLIENT_ID'),
      'PLAID-SECRET': this.configService.get('PLAID_SECRET'),
      'Plaid-Version': this.configService.get('PLAID_VERSION'),
    };
    
    const configuration = new Configuration({
      basePath: PlaidEnvironments[this.configService.get('PLAID_ENV')],
      baseOptions: { headers },
    });

    this.client = new PlaidApi(configuration);
    this.products = this.configService
      .get('PLAID_PRODUCTS')
      .split(',') as Products[];

    this.countryCodes = (
      this.configService.get('PLAID_COUNTRY_CODES') || 'US'
    ).split(',') as CountryCode[];
    this.logger = new Logger(PlaidService.name);
  }

  private catchError(err: AxiosError | ApolloError | Error): void {
    if (err.isAxiosError) {
      const plaidError: ModelError = err.response?.data;
      this.logger.error(plaidError);
      throw new BadRequestError(
        plaidError?.display_message || plaidError?.error_message,
        plaidError
      );
    } else if (err instanceof ApolloError) {
      this.logger.error(err);
      throw err;
    }

    this.logger.error(`Unknown plaid error - ${err.message}`);
    throw new BadRequestError(`Unknown plaid error - ${err.message}`);
  }

  async createLinkToken(
    user_account_id: string
  ): Promise<LinkTokenCreateResponse> {
    const configs = {
      android_package_name: 'com.allio',
      user: { client_user_id: user_account_id },
      client_name: this.configService.get('PLAID_CLIENT_NAME'),
      products: this.products,
      country_codes: this.countryCodes,
      language: this.configService.get('PLAID_LANGUAGE'),
    };

    try {
      const { data } = await this.client.linkTokenCreate(configs);

      this.logger.debug('Created Plaid link token for user: ', user_account_id);

      return data;
    } catch (err) {
      this.catchError(err);
    }
    return null;
  }

  async exchangePublicToken(
    public_token: string
  ): Promise<ItemPublicTokenExchangeResponse> {
    try {
      const { data } = await this.client.itemPublicTokenExchange({
        public_token,
      });

      return data;
    } catch (err) {
      this.catchError(err);
    }
    return null;
  }

  async createProcessorToken(
    access_token: string,
    account_id: string,
    processor: ProcessorTokenCreateRequestProcessorEnum
  ): Promise<ProcessorTokenCreateResponse> {
    try {
      const request: ProcessorTokenCreateRequest = {
        access_token,
        account_id,
        processor,
      };

      const { data } = await this.client.processorTokenCreate(request);

      return data;
    } catch (err) {
      this.catchError(err);
    }
  }

  async createProcessorTokenForDriveWealth(
    access_token: string,
    account_id: string,
  ): Promise<ProcessorTokenCreateResponse> {
    return this.createProcessorToken(access_token, account_id, ProcessorTokenCreateRequestProcessorEnum.Drivewealth);
  }

  async removeItem(access_token: string): Promise<ItemRemoveResponse> {
    try {
      const request: ItemRemoveRequest = {
        access_token,
      };

      const { data } = await this.client.itemRemove(request);

      return data;
    } catch (err) {
      this.catchError(err);
    }
  }

  async getInstitutionById(institutionId: string): Promise<Institution> {
    try {
      const { data } = await this.client.institutionsGetById({
        institution_id: institutionId,
        country_codes: this.countryCodes,
      });
      return data.institution;
    } catch (err) {
      this.catchError(err);
    }
  }

  async getAccount(
    accessToken: string,
    accountId: string
  ): Promise<AccountBase> {
    try {
      const { data } = await this.client.accountsGet({
        access_token: accessToken,
        options: {
          account_ids: [accountId],
        },
      });

      const { accounts } = data;
      if (accounts.length !== 1) {
        throw new NotFoundError('Account not found');
      }

      return accounts[0];
    } catch (err) {
      this.catchError(err);
    }
  }

  async getTransaction({
    accessToken,
    startDate,
    endDate,
  }: {
    accessToken: string;
    startDate: string;
    endDate: string;
  }): Promise<Transaction[]> {
    try {
      const { data } = await this.client.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
      });
      let transactions = data.transactions;
      const totalTransactions = data.total_transactions;
      while (transactions.length < totalTransactions) {
        const paginatedResponse = await this.client.transactionsGet({
          access_token: accessToken,
          start_date: startDate,
          end_date: endDate,
          options: {
            offset: transactions.length,
          },
        });
        transactions = transactions.concat(paginatedResponse.data.transactions);
      }

      if (!transactions.length) {
        this.logger.debug('Transaction history is empty');
      }

      return transactions;
    } catch (err) {
      this.catchError(err);
    }
  }
}

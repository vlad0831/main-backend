import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BaseService } from '../shared/base.service';
import { UserFundingTransaction } from './entities/userFundingTransaction.entity';
import { NotFoundError } from '../shared/errors';
import { QueryOrder } from '@mikro-orm/core';

@Injectable()
export class UserFundingTransactionService extends BaseService<UserFundingTransaction> {
  protected logger: Logger;
  public constructor(
    @InjectRepository(UserFundingTransaction)
    private readonly userFundingTransactionServiceRepo: EntityRepository<UserFundingTransaction>
  ) {
    super(userFundingTransactionServiceRepo);
    this.logger = new Logger(UserFundingTransactionService.name);
  }

  public async getUserFundingTransaction(
    userId: string
  ): Promise<UserFundingTransaction[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const userFundingTransactionList =
      await this.userFundingTransactionServiceRepo.find(
        { userId, active: true },
        {
          populate: {
            fundingMethod: true,
          },
          orderBy: {
            createdAt: QueryOrder.ASC,
          },
        }
      );

    return userFundingTransactionList;
  }
}

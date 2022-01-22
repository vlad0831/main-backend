import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BaseService } from '../shared/base.service';
import { UserRecurringFundingSetting } from './entities/userRecurringFundingSetting.entity';
import { RecurringFundingSettingInput } from './dto/recurringFundingSetting.input';
import { UserFundingMethod } from '../user-funding-method/entities/userFundingMethod.entity';
import { calcNextExecutionDate } from '../shared/utils/helper';

@Injectable()
export class UserRecurringFundingSettingService extends BaseService<UserRecurringFundingSetting> {
  protected logger: Logger;
  public constructor(
    @InjectRepository(UserRecurringFundingSetting)
    private readonly userRecurringFundingSettingServiceRepo: EntityRepository<UserRecurringFundingSetting>
  ) {
    super(userRecurringFundingSettingServiceRepo);
    this.logger = new Logger(UserRecurringFundingSettingService.name);
  }
  public async createUserRecurringFundingSetting(
    fundingMethod: UserFundingMethod,
    { frequency, amount, currency, day }: RecurringFundingSettingInput
  ): Promise<UserRecurringFundingSetting> {
    const userRecurringSetting = this.create({
      fundingMethod,
      frequency,
      amount,
      currency,
      day,
      nextExecutionDate: calcNextExecutionDate(frequency, day),
    });
    await this.persistAndFlush(userRecurringSetting);
    return userRecurringSetting;
  }
}

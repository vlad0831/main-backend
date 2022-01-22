import { Injectable, Logger } from '@nestjs/common';
import { UserInvestmentValueService } from '../investment-value/userInvestmentValue.service';
import { InvestmentValueService } from '../investment-value/investmentValue.service';
import { InvestmentValue } from '../investment-value/entities/investmentValue.entity';
import { SeedConfig } from './seed.config';
import { UserInvestmentValue } from '../investment-value/entities/userInvestmentValue.entity';

@Injectable()
export class UserInvestmentValueFactory {
  protected readonly logger: Logger;

  public constructor(
    private readonly userInvestmentValueService: UserInvestmentValueService,
    private readonly investmentValueService: InvestmentValueService,
    private readonly seedConfig: SeedConfig
  ) {
    this.logger = new Logger(UserInvestmentValueFactory.name);
  }

  public async create() {
    const investmentValueList: InvestmentValue[] =
      await this.investmentValueService.find({
        investmentValue: { $in: ['NACP', 'SHE', 'ICLN', 'PHO', 'BIBL'] },
      });
    const userId: string = this.seedConfig.getUserId();

    let userInvestmentValueList: UserInvestmentValue[] = [];
    if (this.seedConfig.isDev) {
      userInvestmentValueList = investmentValueList.map((investmentValue) =>
        this.userInvestmentValueService.create({
          userId,
          investmentValue,
        })
      );
    }

    if (userId) {
      await this.userInvestmentValueService.nativeDelete({ userId });
    }

    await this.userInvestmentValueService.persistAndFlush(
      userInvestmentValueList
    );
  }
}

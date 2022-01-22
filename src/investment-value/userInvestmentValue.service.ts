import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { NotFoundError } from '../shared/errors';
import { UserInvestmentValue } from './entities/userInvestmentValue.entity';
import { InvestmentValueService } from './investmentValue.service';
import { InvestmentValue } from './entities/investmentValue.entity';
import { InvestmentQuestionnaireOption } from '../investment-questionnaire/entities/investmentQuestionnaireOption.entity';

@Injectable()
export class UserInvestmentValueService extends BaseService<UserInvestmentValue> {
  protected readonly logger: Logger;
  constructor(
    @InjectRepository(UserInvestmentValue)
    private readonly userInvestmentValueRepository: EntityRepository<UserInvestmentValue>,
    private readonly investmentValueService: InvestmentValueService
  ) {
    super(userInvestmentValueRepository);
    this.logger = new Logger(UserInvestmentValueService.name);
  }

  public async setUserInvestmentValueList(
    userId: string,
    questionnaireOptions: InvestmentQuestionnaireOption[]
  ): Promise<InvestmentValue[]>;
  public async setUserInvestmentValueList(
    userId: string,
    investmentValueIdList: string[]
  ): Promise<InvestmentValue[]>;
  public async setUserInvestmentValueList(
    userId: string,
    payload: any[]
  ): Promise<InvestmentValue[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    let userInvestmentValueList: UserInvestmentValue[] = [];
    let investmentValueEntityList: InvestmentValue[] = [];

    if (payload.length > 0) {
      let filterList: string[];
      if (payload[0] instanceof InvestmentQuestionnaireOption) {
        filterList =
          this.investmentValueService.mapQuestionnaireOptionToInvestmentValue(
            payload
          );
        investmentValueEntityList = await this.investmentValueService.find({
          investmentValue: { $in: filterList },
        });
      } else {
        filterList = payload;
        investmentValueEntityList =
          await this.investmentValueService.findByIdList(filterList);
      }

      if (filterList.length !== investmentValueEntityList.length) {
        throw new NotFoundError('Some investment values are missing');
      }

      userInvestmentValueList = investmentValueEntityList.map(
        (investmentValue) =>
          this.create({
            userId,
            investmentValue,
          })
      );
    }

    await this.removeUserInvestmentValues(userId);
    await this.persistAndFlush(userInvestmentValueList);

    return investmentValueEntityList;
  }

  public async removeUserInvestmentValues(userId: string): Promise<void> {
    const oldInvestmentValueList = await this.find({ userId });
    await this.remove(oldInvestmentValueList);
  }

  public async getUserInvestmentValueList(
    userId: string
  ): Promise<InvestmentValue[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }
    const userInvestmentValueList: UserInvestmentValue[] = await this.find(
      { userId },
      { populate: { investmentValue: true } }
    );

    return userInvestmentValueList.map(
      ({ investmentValue }) => investmentValue
    );
  }
}

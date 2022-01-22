import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { InvestmentValue } from './entities/investmentValue.entity';
import { InvestmentQuestionnaireOption } from '../investment-questionnaire/entities/investmentQuestionnaireOption.entity';
import { QueryOrder } from '@mikro-orm/core';

@Injectable()
export class InvestmentValueService extends BaseService<InvestmentValue> {
  protected readonly logger: Logger;
  constructor(
    @InjectRepository(InvestmentValue)
    private readonly investmentValueRepository: EntityRepository<InvestmentValue>
  ) {
    super(investmentValueRepository);
    this.logger = new Logger(InvestmentValueService.name);
  }

  public mapQuestionnaireOptionToInvestmentValue(
    questionnaireOptions: InvestmentQuestionnaireOption[]
  ): string[] {
    // Change this mapping too if the questionnaire is changed
    const mapOrderToTicker = {
      0: 'NACP',
      1: 'SHE',
      2: 'ICLN',
      3: 'PHO',
      4: 'BIBL',
    };

    const resultSet = questionnaireOptions.reduce<Set<string>>(
      (set, option) => {
        const ticker = mapOrderToTicker[option.order];
        if (ticker !== undefined || ticker !== null) {
          set.add(ticker);
        }
        return set;
      },
      new Set()
    );

    return [...resultSet];
  }

  public getList(): Promise<InvestmentValue[]> {
    return this.findAll({ orderBy: { description: QueryOrder.ASC } });
  }
}

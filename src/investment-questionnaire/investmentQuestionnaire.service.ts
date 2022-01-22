import { Injectable, Logger } from '@nestjs/common';
import { InvestmentQuestionnaire } from './entities/investmentQuestionnaire.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FindOptions, QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { GetAllQuestionnaireArgs } from './dto/getAllQuestionnaire.args';
import { BaseService } from '../shared/base.service';
import { NotFoundError } from '../shared/errors';

@Injectable()
export class InvestmentQuestionnaireService extends BaseService<InvestmentQuestionnaire> {
  protected readonly logger: Logger;
  public constructor(
    @InjectRepository(InvestmentQuestionnaire)
    private readonly investmentQuestionnaireRepo: EntityRepository<InvestmentQuestionnaire>
  ) {
    super(investmentQuestionnaireRepo);
    this.logger = new Logger(InvestmentQuestionnaireService.name);
  }

  private defaultOptions: FindOptions<InvestmentQuestionnaire> = {
    populate: {
      options: true,
    },
    orderBy: {
      order: QueryOrder.ASC,
      options: {
        order: QueryOrder.ASC,
      },
    },
  };

  public async findAllOrSpecificQuestionnaire(
    args: GetAllQuestionnaireArgs
  ): Promise<InvestmentQuestionnaire[]> {
    const where = args.id ? { id: args.id } : {};
    const items = await this.find(where, this.defaultOptions);

    if (args.id && items.length === 0) {
      throw new NotFoundError('Questionnaire not found');
    }

    return items;
  }
}

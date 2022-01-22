import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BaseService } from '../shared/base.service';
import { InvestmentQuestionnaireOption } from './entities/investmentQuestionnaireOption.entity';

@Injectable()
export class InvestmentQuestionnaireOptionService extends BaseService<InvestmentQuestionnaireOption> {
  protected readonly logger: Logger;
  public constructor(
    @InjectRepository(InvestmentQuestionnaireOption)
    private readonly investmentQuestionnaireOptionRepo: EntityRepository<InvestmentQuestionnaireOption>
  ) {
    super(investmentQuestionnaireOptionRepo);
    this.logger = new Logger(InvestmentQuestionnaireOptionService.name);
  }
}

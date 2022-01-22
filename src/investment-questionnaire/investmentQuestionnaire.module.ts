import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { InvestmentQuestionnaire } from './entities/investmentQuestionnaire.entity';
import { InvestmentQuestionnaireResolver } from './investmentQuestionnaire.resolver';
import { InvestmentQuestionnaireService } from './investmentQuestionnaire.service';
import { InvestmentQuestionnaireOptionService } from './investmentQuestionnaireOption.service';
import { InvestmentQuestionnaireOption } from './entities/investmentQuestionnaireOption.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      InvestmentQuestionnaire,
      InvestmentQuestionnaireOption,
    ]),
  ],
  providers: [
    InvestmentQuestionnaireService,
    InvestmentQuestionnaireOptionService,
    InvestmentQuestionnaireResolver,
  ],
  exports: [
    InvestmentQuestionnaireService,
    InvestmentQuestionnaireOptionService,
  ],
})
export class InvestmentQuestionnaireModule {}

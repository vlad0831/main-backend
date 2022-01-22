import { Injectable, Logger } from '@nestjs/common';
import { UserInvestmentQuestionnaireAnswer } from '../user-investment-questionnaire/entities/userInvestmentQuestionnaireAnswer.entity';
import { SeedConfig } from './seed.config';
import { UserInvestmentQuestionnaireService } from '../user-investment-questionnaire/userInvestmentQuestionnaire.service';
import { InvestmentQuestionnaireOptionService } from '../investment-questionnaire/investmentQuestionnaireOption.service';
import { InvestmentQuestionnaireOption } from '../investment-questionnaire/entities/investmentQuestionnaireOption.entity';

@Injectable()
export class UserQuestionnaireAnswerFactory {
  protected readonly logger: Logger;

  public constructor(
    private readonly investmentQuestionnaireOptionService: InvestmentQuestionnaireOptionService,
    private readonly userQuestionnaireService: UserInvestmentQuestionnaireService,
    private readonly seedConfig: SeedConfig
  ) {
    this.logger = new Logger(UserQuestionnaireAnswerFactory.name);
  }

  public async create() {
    let answerList: UserInvestmentQuestionnaireAnswer[] = [];
    const userId = this.seedConfig.getUserId();
    if (this.seedConfig.isDev) {
      const questionnaireOptionList: InvestmentQuestionnaireOption[] =
        await this.investmentQuestionnaireOptionService.find(
          {
            option: {
              $in: [
                'Expert',
                // risk level
                'Very Aggressive',
                // investment values
                'Minority Empowerment',
                'Gender Diversity',
                'Renewable Energy',
                'Clean water',
                'Spiritual',
              ],
            },
          },
          {
            populate: {
              questionnaire: true,
            },
          }
        );
      answerList = questionnaireOptionList.map((selectedOption) =>
        this.userQuestionnaireService.create({
          selectedOption,
          userId,
          questionnaire: selectedOption.questionnaire,
        })
      );
    }

    if (userId) {
      await this.userQuestionnaireService.nativeDelete({ userId });
    }

    await this.userQuestionnaireService.persistAndFlush(answerList);
  }
}

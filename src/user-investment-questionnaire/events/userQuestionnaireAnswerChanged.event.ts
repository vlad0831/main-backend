import { InvestmentQuestionnaire } from '../../investment-questionnaire/entities/investmentQuestionnaire.entity';
import { InvestmentQuestionnaireOption } from '../../investment-questionnaire/entities/investmentQuestionnaireOption.entity';

export const USER_QUESTIONNAIRE_ANSWER_CHANGED =
  'user_questionnaire_answer.changed';

export class UserQuestionnaireAnswerChangedEvent {
  public constructor(
    public readonly userId: string,
    public readonly investmentQuestionnaire: InvestmentQuestionnaire,
    public readonly selectedOptionList: InvestmentQuestionnaireOption[]
  ) {}
}

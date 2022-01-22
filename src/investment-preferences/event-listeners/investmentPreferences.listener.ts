import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  USER_QUESTIONNAIRE_ANSWER_CHANGED,
  UserQuestionnaireAnswerChangedEvent,
} from '../../user-investment-questionnaire/events';
import { InvestmentPreferencesService } from '../investmentPreferences.service';

@Injectable()
export class InvestmentPreferencesListener {
  public constructor(
    private readonly investmentPreferencesService: InvestmentPreferencesService
  ) {}

  @OnEvent(USER_QUESTIONNAIRE_ANSWER_CHANGED)
  public async handleQuestionnaireAnswerChangedEvent(
    payload: UserQuestionnaireAnswerChangedEvent
  ) {
    return this.investmentPreferencesService.setPreferencesFromQuestionnaire(
      payload
    );
  }
}

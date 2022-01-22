import { Injectable, Logger } from '@nestjs/common';
import { GetUserQuestionnaireAnswerArgs } from './dto/getUserQuestionnaireAnswer.args';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserInvestmentQuestionnaireAnswer } from './entities/userInvestmentQuestionnaireAnswer.entity';
import { QueryOrder, MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { SetUserQuestionnaireAnswerArgs } from './dto/setUserQuestionnaireAnswer.args';
import { InvestmentQuestionnaire } from '../investment-questionnaire/entities/investmentQuestionnaire.entity';
import { InvestmentQuestionnaireOption } from '../investment-questionnaire/entities/investmentQuestionnaireOption.entity';
import { NotFoundError } from '../shared/errors';
import { FilterQuery } from '@mikro-orm/core/typings';
import {
  PostgreSqlDriver,
  EntityManager,
  QueryBuilder,
} from '@mikro-orm/postgresql';
import { BaseService } from '../shared/base.service';
import { InvestmentQuestionnaireService } from '../investment-questionnaire/investmentQuestionnaire.service';
import { InvestmentQuestionnaireOptionService } from '../investment-questionnaire/investmentQuestionnaireOption.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  USER_QUESTIONNAIRE_ANSWER_CHANGED,
  UserQuestionnaireAnswerChangedEvent,
} from './events';

@Injectable()
export class UserInvestmentQuestionnaireService extends BaseService<UserInvestmentQuestionnaireAnswer> {
  private readonly em: EntityManager;
  protected logger: Logger;

  public constructor(
    @InjectRepository(UserInvestmentQuestionnaireAnswer)
    private readonly userQuestionnaireAnswerRepo: EntityRepository<UserInvestmentQuestionnaireAnswer>,
    private readonly investmentQuestionnaireService: InvestmentQuestionnaireService,
    private readonly investmentQuestionnaireOptionService: InvestmentQuestionnaireOptionService,
    private readonly orm: MikroORM<PostgreSqlDriver>,
    private readonly eventEmitter: EventEmitter2
  ) {
    super(userQuestionnaireAnswerRepo);
    this.em = this.orm.em;
    this.logger = new Logger(UserInvestmentQuestionnaireService.name);
  }

  public async getAnswers(
    args: GetUserQuestionnaireAnswerArgs,
    userId: string
  ) {
    let where: FilterQuery<InvestmentQuestionnaire> = undefined;
    if (args.questionnaireId) {
      where = { id: args.questionnaireId };
    }

    return await this.getAnswersByQuestionnaireFilter({
      where,
      userId,
    });
  }

  public async getAnswersByQuestionnaireFilter({
    where,
    userId,
    selectParam,
    joinAndSelectParams,
    tableAlias,
  }: {
    where?: FilterQuery<InvestmentQuestionnaire>;
    tableAlias?: string;
    selectParam?: Parameters<QueryBuilder['select']>;
    userId: string;
    joinAndSelectParams?: Parameters<QueryBuilder['joinAndSelect']>[];
  }) {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    let qb = this.em
      .createQueryBuilder(UserInvestmentQuestionnaireAnswer, tableAlias)
      .select(selectParam || '*')
      .where({
        ...(where ? { questionnaire: where } : {}),
        userId: userId,
      })
      .orderBy({ createdAt: QueryOrder.ASC });
    if (joinAndSelectParams) {
      joinAndSelectParams.forEach((joinAndSelectParam) => {
        qb = qb.joinAndSelect(...joinAndSelectParam);
      });
    }

    return await qb.getResult();
  }

  public async setAnswer(
    args: SetUserQuestionnaireAnswerArgs,
    userId: string
  ): Promise<UserInvestmentQuestionnaireAnswer[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const { questionnaireId, answer, selectedOptionIdList = [] } = args;
    const questionnaire: InvestmentQuestionnaire =
      await this.investmentQuestionnaireService.findOneOrFail(
        { id: questionnaireId },
        { failHandler: (): any => new NotFoundError('Questionnaire not found') }
      );

    const oldUserAnswerList: UserInvestmentQuestionnaireAnswer[] =
      await this.find({
        userId,
        questionnaire,
      });

    let questionnaireOptionList: InvestmentQuestionnaireOption[] = [];
    let userAnswerList: UserInvestmentQuestionnaireAnswer[] = [];

    if (answer) {
      const userQuestionnaireAnswer: UserInvestmentQuestionnaireAnswer =
        this.userQuestionnaireAnswerRepo.create({
          answer,
          userId,
          questionnaire,
          selectedOption: null,
        });
      userAnswerList = [userQuestionnaireAnswer];
    } else if (selectedOptionIdList && selectedOptionIdList.length > 0) {
      questionnaireOptionList =
        await this.investmentQuestionnaireOptionService.find({
          id: { $in: selectedOptionIdList },
          questionnaire,
        });

      if (questionnaireOptionList.length !== selectedOptionIdList.length) {
        const missingOptionId = selectedOptionIdList.find(
          (id) => !questionnaireOptionList.some((asset) => asset.id === id)
        );
        throw new NotFoundError('Investment questionnaire option not found', {
          investmentQuestionnaireOptionId: missingOptionId,
        });
      }
      userAnswerList = questionnaireOptionList.map((selectedOption) =>
        this.create({
          userId,
          questionnaire,
          selectedOption,
        })
      );
    }

    await this.remove(oldUserAnswerList);
    await this.persistAndFlush(userAnswerList);
    await this.eventEmitter.emitAsync(
      USER_QUESTIONNAIRE_ANSWER_CHANGED,
      new UserQuestionnaireAnswerChangedEvent(
        userId,
        questionnaire,
        questionnaireOptionList
      )
    );
    return userAnswerList;
  }
}

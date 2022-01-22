import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserInvestmentQuestionnaireAnswer } from './entities/userInvestmentQuestionnaireAnswer.entity';
import { UserInvestmentQuestionnaireResolver } from './userInvestmentQuestionnaire.resolver';
import { UserInvestmentQuestionnaireService } from './userInvestmentQuestionnaire.service';
import { AuthModule } from '../auth/auth.module';
import { InvestmentQuestionnaireModule } from '../investment-questionnaire/investmentQuestionnaire.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserInvestmentQuestionnaireAnswer]),
    AuthModule,
    InvestmentQuestionnaireModule,
  ],
  providers: [
    UserInvestmentQuestionnaireResolver,
    UserInvestmentQuestionnaireService,
  ],
  exports: [UserInvestmentQuestionnaireService],
})
export class UserInvestmentQuestionnaireModule {}

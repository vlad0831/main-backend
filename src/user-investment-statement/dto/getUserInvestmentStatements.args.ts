import { GetUserPropertiesArgs } from '../../shared/dto/getUserProperties.args';
import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { IsDate, IsEnum } from 'class-validator';
import { IsLessThan } from '../../shared/decorators/lessThan.decorator';

export enum InvestmentStatementType {
  AccountStatement = 'AccountStatement',
  TaxDocument = 'TaxDocument',
  TradeConfirmation = 'TradeConfirmation',
}

@ArgsType()
export class GetUserInvestmentStatementsArgs extends GetUserPropertiesArgs {
  @IsEnum(InvestmentStatementType)
  @Field(() => InvestmentStatementType)
  type: InvestmentStatementType = undefined;

  @IsLessThan((o: GetUserInvestmentStatementsArgs) => o.to)
  @IsDate()
  @Field()
  from: Date = undefined;

  @IsDate()
  @Field()
  to: Date = undefined;
}

registerEnumType(InvestmentStatementType, {
  name: 'InvestmentStatementType',
  description: 'investment statement type',
});

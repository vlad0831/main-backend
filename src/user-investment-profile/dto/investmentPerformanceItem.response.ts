import { Field, ObjectType } from '@nestjs/graphql';
import { AccountPerformanceItem } from '../../drivewealth/types';

@ObjectType()
export class InvestmentPerformanceItemResponse {
  @Field()
  public readonly realizedDayPL: number;

  @Field()
  public readonly unrealizedDayPL: number;

  @Field()
  public readonly cumRealizedPL: number;

  @Field()
  public readonly date: string;

  @Field()
  public readonly equity: number;

  @Field()
  public readonly cash: number;

  @Field()
  public readonly deposits: number;

  @Field()
  public readonly withdrawals: number;

  @Field()
  public readonly fees: number;

  public constructor(item: AccountPerformanceItem) {
    Object.assign(this, item);
  }
}

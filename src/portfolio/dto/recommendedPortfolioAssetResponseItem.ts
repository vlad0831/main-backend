import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RecommendedPortfolioAssetResponseItem {
  @Field(() => ID)
  public readonly id: string;

  @Field()
  public readonly asset: string;

  @Field()
  public readonly weight: number;

  public constructor(props: { id: string; asset: string; weight: number }) {
    this.id = props.id;
    this.asset = props.asset;
    this.weight = props.weight;
  }
}

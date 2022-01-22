// TODO: Remove this response after the entity file is managed.
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetUserStockResponse {
  @Field(() => ID)
  id: string;

  @Field()
  category: string;

  @Field()
  name: string;

  @Field()
  description: string;
}

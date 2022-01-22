import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BooleanResultResponse {
  @Field()
  result: boolean = undefined;
}

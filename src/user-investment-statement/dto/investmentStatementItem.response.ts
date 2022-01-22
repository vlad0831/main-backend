import { Field, ObjectType } from '@nestjs/graphql';
import { Statement } from '../../drivewealth/types';

@ObjectType()
export class InvestmentStatementItemResponse {
  @Field()
  displayName: string;

  @Field()
  fileKey: string;

  public constructor(props: Statement) {
    this.displayName = props.displayName;
    this.fileKey = props.fileKey;
  }
}

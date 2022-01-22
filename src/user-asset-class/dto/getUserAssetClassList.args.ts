import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetUserAssetClassListArgs {
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  userId: string = undefined;
}

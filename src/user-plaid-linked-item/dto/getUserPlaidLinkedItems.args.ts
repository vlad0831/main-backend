import { GetUserPropertiesArgs } from '../../shared/dto/getUserProperties.args';
import { ArgsType, Field } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserPlaidIdentifierInput } from './userPlaidIdentifier.input';

@ArgsType()
export class GetUserPlaidLinkedItemsArgs extends GetUserPropertiesArgs {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => UserPlaidIdentifierInput)
  @Field(() => [UserPlaidIdentifierInput], { nullable: true })
  plaidLinkedItemList?: UserPlaidIdentifierInput[] = undefined;
}

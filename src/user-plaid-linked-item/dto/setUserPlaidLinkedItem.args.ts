import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { UserPlaidLinkedItemInput } from './userPlaidLinkedItem.input';
import { GetUserPropertiesArgs } from '../../shared/dto/getUserProperties.args';

@ArgsType()
export class SetUserPlaidLinkedItemArgs extends GetUserPropertiesArgs {
  @ArrayMinSize(1)
  @IsArray()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => UserPlaidLinkedItemInput)
  @Field(() => [UserPlaidLinkedItemInput])
  plaidLinkedItemList: UserPlaidLinkedItemInput[] = undefined;
}

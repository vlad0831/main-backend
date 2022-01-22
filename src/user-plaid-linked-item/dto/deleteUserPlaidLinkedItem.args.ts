import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { GetUserPropertiesArgs } from '../../shared/dto/getUserProperties.args';
import { UserPlaidIdentifierInput } from './userPlaidIdentifier.input';

@ArgsType()
export class DeleteUserPlaidLinkedItemArgs extends GetUserPropertiesArgs {
  @ArrayMinSize(1)
  @IsArray()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => UserPlaidIdentifierInput)
  @Field(() => [UserPlaidIdentifierInput])
  plaidLinkedItemList: UserPlaidIdentifierInput[] = undefined;
}

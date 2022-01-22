import { ArgsType } from '@nestjs/graphql';
import { GetUserPropertiesArgs } from '../../shared/dto/getUserProperties.args';

@ArgsType()
export class GetUserRiskLevelArgs extends GetUserPropertiesArgs {}

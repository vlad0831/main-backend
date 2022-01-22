import { GetUserPropertiesArgs } from '../../shared/dto/getUserProperties.args';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetUserInvestmentPreferencesArgs extends GetUserPropertiesArgs {}

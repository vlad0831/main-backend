import { Injectable } from '@nestjs/common';
import { GetUserInvestmentStatementsArgs } from './dto/getUserInvestmentStatements.args';
import { InvestmentStatementItemResponse } from './dto/investmentStatementItem.response';
import { UserInvestmentProfileService } from '../user-investment-profile/userInvestmentProfile.service';
import { NotFoundError } from '../shared/errors';
import { UserInvestmentProfile } from '../user-investment-profile/entities/userInvestmentProfile.entity';
import { DriveWealthService } from '../drivewealth/drivewealth.service';

@Injectable()
export class UserInvestmentStatementService {
  public constructor(
    private readonly userInvestmentProfileService: UserInvestmentProfileService,
    private readonly driveWealthService: DriveWealthService
  ) {}

  public async getUserInvestmentStatements(
    userId: string,
    args: GetUserInvestmentStatementsArgs
  ): Promise<InvestmentStatementItemResponse[]> {
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const investmentProfile: UserInvestmentProfile =
      await this.userInvestmentProfileService.getByUserId(userId);

    const statements = await this.driveWealthService.getStatements({
      accountId: investmentProfile.accountId,
      type: args.type,
      from: args.from.toISOString(),
      to: args.to.toISOString(),
    });

    return statements.map(
      (statement) => new InvestmentStatementItemResponse(statement)
    );
  }
}

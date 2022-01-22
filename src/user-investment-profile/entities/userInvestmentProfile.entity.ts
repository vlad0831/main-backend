import { Base } from '../../shared/base.entity';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class UserInvestmentProfile extends Base<UserInvestmentProfile, 'id'> {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Property({ type: 'uuid' })
  userId: string;

  @Property({ type: 'uuid' })
  driveWealthUserId: string;

  @Property()
  accountId: string;

  @Property()
  accountNo: string;

  @Property()
  portfolioId: string;
}

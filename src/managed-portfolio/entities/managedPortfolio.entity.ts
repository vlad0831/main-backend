import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Base } from '../../shared/base.entity';

@Entity()
export class ManagedPortfolio extends Base<ManagedPortfolio, 'id'> {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Property({ unique: true })
  allioPortfolioId: string;

  @Property({ unique: true })
  driveWealthPortfolioId: string;

  @Property({ unique: true })
  driveWealthFundId: string;
}

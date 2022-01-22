import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Base } from '../../shared/base.entity';

@Entity()
export class UserRecommendedPortfolio extends Base<
  UserRecommendedPortfolio,
  'id'
> {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Property({ type: 'uuid' })
  userId: string;

  @Property({ length: 50 })
  asset: string;

  @Property({ columnType: 'decimal' })
  weight: number;
}

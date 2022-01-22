import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Base } from '../../shared/base.entity';

@Entity()
export class PersonaWebhookEvent extends Base<PersonaWebhookEvent, 'id'> {
  @PrimaryKey({ defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Property({ nullable: false })
  event: string;

  @Property({ nullable: false })
  subject: string;

  @Property({ nullable: false })
  subjectId: string;
}

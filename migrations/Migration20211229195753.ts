import { Migration } from '@mikro-orm/migrations';

export class Migration20211229195753 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_required_persona_inquiry" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "inquiry_id" varchar(255) not null, "purpose" text check ("purpose" in (\'Onboarding\')) not null);'
    );
    this.addSql(
      'alter table "user_required_persona_inquiry" add constraint "user_required_persona_inquiry_pkey" primary key ("id");'
    );
  }
}

import { Migration } from '@mikro-orm/migrations';

export class Migration20211217110224 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_persona_inquiry" ("id" varchar(255) not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "status" varchar(255) not null, "inquiry_created_at" timestamptz null, "inquiry_started_at" timestamptz null, "inquiry_completed_at" timestamptz null, "inquiry_failed_at" timestamptz null, "inquiry_decisioned_at" timestamptz null, "inquiry_expired_at" timestamptz null, "inquiry_redacted_at" timestamptz null, "attribute" jsonb not null default \'{}\');'
    );
    this.addSql(
      'alter table "user_persona_inquiry" add constraint "user_persona_inquiry_pkey" primary key ("id");'
    );

    this.addSql(
      'create table "persona_webhook_event" ("id" varchar(255) not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "event" varchar(255) not null, "subject" varchar(255) not null, "subject_id" varchar(255) not null);'
    );
    this.addSql(
      'alter table "persona_webhook_event" add constraint "persona_webhook_event_pkey" primary key ("id");'
    );
  }
}

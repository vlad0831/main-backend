import { Migration } from '@mikro-orm/migrations';

export class Migration20211014172705 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "risk_level" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "risk_level" int4 not null, "description" varchar(255) not null);'
    );
    this.addSql(
      'alter table "risk_level" add constraint "risk_level_pkey" primary key ("id");'
    );

    this.addSql(
      'create table "user_risk_level" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "risk_level_id" uuid not null);'
    );
    this.addSql(
      'alter table "user_risk_level" add constraint "user_risk_level_pkey" primary key ("id");'
    );

    this.addSql(
      'alter table "user_risk_level" add constraint "user_risk_level_risk_level_id_foreign" foreign key ("risk_level_id") references "risk_level" ("id") on update cascade;'
    );
  }
}

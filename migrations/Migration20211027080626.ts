import { Migration } from '@mikro-orm/migrations';

export class Migration20211027080626 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_recommended_portfolio" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "asset" varchar(50) not null, "weight" int4 not null);');
    this.addSql('alter table "user_recommended_portfolio" add constraint "user_recommended_portfolio_pkey" primary key ("id");');
  }

}

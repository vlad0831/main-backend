import { Migration } from '@mikro-orm/migrations';

export class Migration20211215122620 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_investment_profile" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "drive_wealth_user_id" uuid not null, "account_id" varchar(255) not null, "account_no" varchar(255) not null, "portfolio_id" varchar(255) not null);'
    );
    this.addSql(
      'alter table "user_investment_profile" add constraint "user_investment_profile_pkey" primary key ("id");'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_investment_profile"');
  }
}

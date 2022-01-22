import { Migration } from '@mikro-orm/migrations';

export class Migration20211210224134 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "managed_fund" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "allio_portfolio_id" uuid not null, "drive_wealth_fund_id" varchar(255) not null);'
    );
    this.addSql(
      'alter table "managed_fund" add constraint "managed_fund_pkey" primary key ("id");'
    );
    this.addSql(
      'alter table "managed_fund" add constraint "managed_fund_allio_portfolio_id_unique" unique ("allio_portfolio_id");'
    );
    this.addSql(
      'alter table "managed_fund" add constraint "managed_fund_drive_wealth_fund_id_unique" unique ("drive_wealth_fund_id");'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "managed_fund";');
  }
}

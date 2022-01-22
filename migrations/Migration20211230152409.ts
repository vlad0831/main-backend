import { Migration } from '@mikro-orm/migrations';

export class Migration20211230152409 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "managed_portfolio" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "allio_portfolio_id" varchar(255) not null, "drive_wealth_portfolio_id" varchar(255) not null, "drive_wealth_fund_id" varchar(255) not null);'
    );
    this.addSql(
      'alter table "managed_portfolio" add constraint "managed_portfolio_pkey" primary key ("id");'
    );
    this.addSql(
      'alter table "managed_portfolio" add constraint "managed_portfolio_allio_portfolio_id_unique" unique ("allio_portfolio_id");'
    );
    this.addSql(
      'alter table "managed_portfolio" add constraint "managed_portfolio_drive_wealth_portfolio_id_unique" unique ("drive_wealth_portfolio_id");'
    );
    this.addSql(
      'alter table "managed_portfolio" add constraint "managed_portfolio_drive_wealth_fund_id_unique" unique ("drive_wealth_fund_id");'
    );

    this.addSql('drop table if exists "managed_fund" cascade;');
    this.addSql('drop table if exists "user_investment_fund" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "managed_portfolio" cascade;');

    this.addSql(
      'create table "managed_fund" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "allio_fund_id" varchar(255) not null, "drive_wealth_fund_id" varchar(255) not null);'
    );
    this.addSql(
      'alter table "managed_fund" add constraint "managed_fund_pkey" primary key ("id");'
    );
    this.addSql(
      'alter table "managed_fund" add constraint "managed_fund_allio_fund_id_unique" unique ("allio_fund_id");'
    );
    this.addSql(
      'alter table "managed_fund" add constraint "managed_fund_drive_wealth_fund_id_unique" unique ("drive_wealth_fund_id");'
    );

    this.addSql(
      'create table "user_investment_fund" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "drive_wealth_fund_id" varchar(255) not null, "investment_profile_id" uuid not null);'
    );
    this.addSql(
      'alter table "user_investment_fund" add constraint "user_investment_fund_pkey" primary key ("id");'
    );

    this.addSql(
      'alter table "user_investment_fund" add constraint "user_investment_fund_investment_profile_id_foreign" foreign key ("investment_profile_id") references "user_investment_profile" ("id") on update cascade;'
    );
  }
}

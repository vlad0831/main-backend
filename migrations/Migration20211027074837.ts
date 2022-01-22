import { Migration } from '@mikro-orm/migrations';

export class Migration20211027074837 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "investment_value" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "investment_value" varchar(50) not null, "description" varchar(255) not null);');
    this.addSql('alter table "investment_value" add constraint "investment_value_pkey" primary key ("id");');

    this.addSql('create table "user_investment_value" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "investment_value_id" uuid not null);');
    this.addSql('alter table "user_investment_value" add constraint "user_investment_value_pkey" primary key ("id");');

    this.addSql('alter table "user_investment_value" add constraint "user_investment_value_investment_value_id_foreign" foreign key ("investment_value_id") references "investment_value" ("id") on update cascade;');
  }

}

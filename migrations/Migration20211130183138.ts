import { Migration } from '@mikro-orm/migrations';

export class Migration20211130183138 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_funding_method" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "method" text check ("method" in (\'OneTime\', \'Recurring\', \'RoundUp\')) not null, "plaid_linked_item_id" uuid not null);'
    );
    this.addSql(
      'alter table "user_funding_method" add constraint "user_funding_method_pkey" primary key ("id");'
    );

    this.addSql(
      'create table "user_funding_transaction" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "from_account_table" text not null, "from_account_id" uuid not null, "to_account_table" text not null, "to_account_id" uuid not null, "funding_method_id" uuid null, "status_number" int not null default 0, "amount" decimal not null, "currency" varchar(3) not null default \'USD\', "execution_date" timestamptz not null, "attribute" jsonb not null default \'{}\', "note" text null);'
    );
    this.addSql(
      'alter table "user_funding_transaction" add constraint "user_funding_transaction_pkey" primary key ("id");'
    );

    this.addSql(
      'create table "user_recurring_funding_setting" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "funding_method_id" uuid not null, "frequency" text check ("frequency" in (\'Daily\', \'Weekly\', \'Biweekly\', \'Monthly\')) not null, "day" int not null, "amount" decimal not null, "currency" varchar(3) not null default \'USD\', "next_execution_date" timestamptz not null);'
    );
    this.addSql(
      'alter table "user_recurring_funding_setting" add constraint "user_recurring_funding_setting_pkey" primary key ("id");'
    );
    this.addSql(
      'alter table "user_recurring_funding_setting" add constraint "user_recurring_funding_setting_funding_method_id_unique" unique ("funding_method_id");'
    );

    this.addSql(
      'alter table "user_funding_method" add constraint "user_funding_method_plaid_linked_item_id_foreign" foreign key ("plaid_linked_item_id") references "user_plaid_linked_item" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "user_funding_transaction" add constraint "user_funding_transaction_funding_method_id_foreign" foreign key ("funding_method_id") references "user_funding_method" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "user_recurring_funding_setting" add constraint "user_recurring_funding_setting_funding_method_id_foreign" foreign key ("funding_method_id") references "user_funding_method" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_recurring_funding_setting"');
    this.addSql('drop table if exists "user_funding_transaction"');
    this.addSql('drop table if exists "user_funding_method"');
  }
}

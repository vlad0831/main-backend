import { Migration } from '@mikro-orm/migrations';

export class Migration20211112115649 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "static_asset_allocation" drop constraint if exists "static_asset_allocation_category_check";');
    this.addSql('alter table "static_asset_allocation" alter column "category" type text using ("category"::text);');
    this.addSql('alter table "static_asset_allocation" add constraint "static_asset_allocation_category_check" check ("category" in (\'Splash\'));');

    this.addSql('create table "user_plaid_linked_item" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" varchar(255) not null, "access_token" varchar(255) not null default \'\', "item_id" varchar(255) not null default \'\', "account_id" varchar(255) not null default \'\', "institution_id" varchar(255) not null default \'\', "institution_name" varchar(255) not null default \'\', "account_name" varchar(255) not null default \'\', "account_type" varchar(255) not null default \'\', "account_subtype" varchar(255) not null default \'\', "verification_status" text check ("verification_status" in (\'pending_automatic_verification\', \'pending_manual_verification\', \'automatically_verified\', \'manually_verified\', \'verification_expired\', \'verification_failed\')) not null);');
    this.addSql('alter table "user_plaid_linked_item" add constraint "user_plaid_linked_item_pkey" primary key ("id");');
  }

}

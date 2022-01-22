import { Migration } from '@mikro-orm/migrations';

export class Migration20211118153241 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_plaid_linked_item" drop constraint if exists "user_plaid_linked_item_access_token_check";');
    this.addSql('alter table "user_plaid_linked_item" alter column "access_token" type text using ("access_token"::text);');
    this.addSql('alter table "user_plaid_linked_item" alter column "access_token" drop default;');
    this.addSql('alter table "user_plaid_linked_item" drop constraint if exists "user_plaid_linked_item_item_id_check";');
    this.addSql('alter table "user_plaid_linked_item" alter column "item_id" type text using ("item_id"::text);');
    this.addSql('alter table "user_plaid_linked_item" alter column "item_id" drop default;');
    this.addSql('alter table "user_plaid_linked_item" drop constraint if exists "user_plaid_linked_item_account_id_check";');
    this.addSql('alter table "user_plaid_linked_item" alter column "account_id" type text using ("account_id"::text);');
    this.addSql('alter table "user_plaid_linked_item" alter column "account_id" drop default;');
    this.addSql('alter table "user_plaid_linked_item" drop constraint if exists "user_plaid_linked_item_institution_id_check";');
    this.addSql('alter table "user_plaid_linked_item" alter column "institution_id" type text using ("institution_id"::text);');
    this.addSql('alter table "user_plaid_linked_item" alter column "institution_id" drop default;');
    this.addSql('alter table "user_plaid_linked_item" drop constraint if exists "user_plaid_linked_item_institution_name_check";');
    this.addSql('alter table "user_plaid_linked_item" alter column "institution_name" type text using ("institution_name"::text);');
    this.addSql('alter table "user_plaid_linked_item" alter column "institution_name" drop default;');
    this.addSql('alter table "user_plaid_linked_item" drop constraint if exists "user_plaid_linked_item_account_name_check";');
    this.addSql('alter table "user_plaid_linked_item" alter column "account_name" type text using ("account_name"::text);');
    this.addSql('alter table "user_plaid_linked_item" alter column "account_name" drop default;');
    this.addSql('alter table "user_plaid_linked_item" drop constraint if exists "user_plaid_linked_item_account_type_check";');
    this.addSql('alter table "user_plaid_linked_item" alter column "account_type" type text using ("account_type"::text);');
    this.addSql('alter table "user_plaid_linked_item" alter column "account_type" drop default;');
    this.addSql('alter table "user_plaid_linked_item" drop constraint if exists "user_plaid_linked_item_account_subtype_check";');
    this.addSql('alter table "user_plaid_linked_item" alter column "account_subtype" type text using ("account_subtype"::text);');
    this.addSql('alter table "user_plaid_linked_item" alter column "account_subtype" drop default;');

    this.addSql('alter table "static_asset_allocation" drop constraint if exists "static_asset_allocation_category_check";');
    this.addSql('alter table "static_asset_allocation" alter column "category" type text using ("category"::text);');
    this.addSql('alter table "static_asset_allocation" add constraint "static_asset_allocation_category_check" check ("category" in (\'Splash\'));');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20211129171042 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user_plaid_linked_item" drop constraint if exists "user_plaid_linked_item_user_id_check";'
    );
    this.addSql(
      'alter table "user_plaid_linked_item" alter column "user_id" type uuid using ("user_id"::uuid);'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user_plaid_linked_item" alter column "user_id" type varchar(255) using ("user_id"::varchar);'
    );
  }
}

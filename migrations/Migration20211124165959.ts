import { Migration } from '@mikro-orm/migrations';

export class Migration20211124165959 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user_plaid_linked_item" add column "account_mask" text not null;'
    );
  }
}

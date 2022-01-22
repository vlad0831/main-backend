import { Migration } from '@mikro-orm/migrations';

export class Migration20211130004644 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user_plaid_linked_item" alter column "verification_status" drop not null;'
    );
  }
}

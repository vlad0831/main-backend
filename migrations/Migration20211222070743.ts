import { Migration } from '@mikro-orm/migrations';

export class Migration20211222070743 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_plaid_linked_item" add column "drive_wealth_account_id" varchar(255) not null default \'\';');
  }

}

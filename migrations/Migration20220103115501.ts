import { Migration } from '@mikro-orm/migrations';

export class Migration20220103115501 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop table if exists "management_workflow" cascade;');

    this.addSql('drop table if exists "user_kyc_physical_document" cascade;');

    this.addSql('drop table if exists "user_management_workflow" cascade;');

    this.addSql('drop table if exists "user_trade_customer" cascade;');
  }
}

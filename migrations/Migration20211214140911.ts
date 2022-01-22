import { Migration } from '@mikro-orm/migrations';

export class Migration20211214140911 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "managed_fund" rename column "allio_portfolio_id" to "allio_fund_id";'
    );

    this.addSql(
      'alter table "managed_fund" drop constraint "managed_fund_allio_portfolio_id_unique";'
    );

    this.addSql(
      'alter table "managed_fund" add constraint "managed_fund_allio_fund_id_unique" unique ("allio_fund_id");'
    );
  }
}

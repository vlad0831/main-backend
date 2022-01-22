import { Migration } from '@mikro-orm/migrations';

export class Migration20211201174924 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user_recurring_funding_setting" drop constraint if exists "user_recurring_funding_setting_day_check";'
    );
    this.addSql(
      'alter table "user_recurring_funding_setting" alter column "day" type int using ("day"::int);'
    );
    this.addSql(
      'alter table "user_recurring_funding_setting" alter column "day" set default 1;'
    );
  }
}

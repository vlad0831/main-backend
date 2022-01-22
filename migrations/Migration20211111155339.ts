import { Migration } from '@mikro-orm/migrations';

export class Migration20211111155339 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "DELETE FROM user_asset_class where asset_class_id in (SELECT id FROM asset_class where name in ('cash', 'values'));"
    );
    this.addSql("DELETE FROM asset_class where name in ('cash', 'values');");
  }
}

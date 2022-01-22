import { Migration } from '@mikro-orm/migrations';

export class Migration20211019075509 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "asset_class" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "name" varchar(50) not null, "description" varchar(255) not null);'
    );
    this.addSql(
      'alter table "asset_class" add constraint "asset_class_pkey" primary key ("id");'
    );

    this.addSql(
      'create table "user_asset_class" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "asset_class_id" uuid not null);'
    );
    this.addSql(
      'alter table "user_asset_class" add constraint "user_asset_class_pkey" primary key ("id");'
    );

    this.addSql(
      'alter table "user_asset_class" add constraint "user_asset_class_asset_class_id_foreign" foreign key ("asset_class_id") references "asset_class" ("id") on update cascade;'
    );
  }
}

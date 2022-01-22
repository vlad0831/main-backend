import { Migration } from '@mikro-orm/migrations';

export class Migration20211027081834 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "text_static_asset" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "description" varchar(255) not null default \'\', "tag" text[] not null default \'{}\');'
    );
    this.addSql(
      'alter table "text_static_asset" add constraint "text_static_asset_pkey" primary key ("id");'
    );
    this.addSql(
      'alter table "text_static_asset" add constraint "text_static_asset_name_unique" unique ("name");'
    );

    this.addSql(
      'create table "static_asset_allocation" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "description" varchar(255) not null default \'\', "asset_table" text check ("asset_table" in (\'s3_static_asset\', \'text_static_asset\')) not null, "asset_table_id" uuid not null, "category" text check ("category" in (\'Splash\')) not null, "order" int4 not null, "role" text[] not null default \'{}\', "tag" text[] not null default \'{}\');'
    );
    this.addSql(
      'alter table "static_asset_allocation" add constraint "static_asset_allocation_pkey" primary key ("id");'
    );
    this.addSql(
      'alter table "static_asset_allocation" add constraint "static_asset_allocation_name_unique" unique ("name");'
    );

    this.addSql(
      'create table "s3_static_asset" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "type" text check ("type" in (\'Image\', \'Animation\')) not null, "description" varchar(255) not null default \'\', "s3bucket" varchar(255) not null, "s3tag" varchar(255) not null, "s3region" varchar(255) not null default \'\', "tag" text[] not null default \'{}\');'
    );
    this.addSql(
      'alter table "s3_static_asset" add constraint "s3_static_asset_pkey" primary key ("id");'
    );
    this.addSql(
      'alter table "s3_static_asset" add constraint "s3_static_asset_name_unique" unique ("name");'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "s3_static_asset";');
    this.addSql('drop table if exists "static_asset_allocation";');
    this.addSql('drop table if exists "text_static_asset";');
  }
}

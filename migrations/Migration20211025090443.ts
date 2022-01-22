import { Migration } from '@mikro-orm/migrations';

export class Migration20211025090442 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "management_workflow" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "key" text check ("key" in (\'Full\', \'Partial\', \'Self\')) not null, "name" varchar(255) not null, "description" varchar(255) not null);'
    );
    this.addSql(
      'alter table "management_workflow" add constraint "management_workflow_pkey" primary key ("id");'
    );
    this.addSql(
      'alter table "management_workflow" add constraint "management_workflow_key_unique" unique ("key");'
    );

    this.addSql(
      'create table "user_management_workflow" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "management_workflow_id" uuid not null);'
    );
    this.addSql(
      'alter table "user_management_workflow" add constraint "user_management_workflow_pkey" primary key ("id");'
    );

    this.addSql(
      'alter table "user_management_workflow" add constraint "user_management_workflow_management_workflow_id_foreign" foreign key ("management_workflow_id") references "management_workflow" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_management_workflow"');
    this.addSql('drop table if exists "management_workflow"');
  }
}

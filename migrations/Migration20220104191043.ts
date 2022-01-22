import { Migration } from '@mikro-orm/migrations';

export class Migration20220104191043 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user_required_persona_inquiry" drop constraint if exists "user_required_persona_inquiry_inquiry_id_check";'
    );
    this.addSql(
      'alter table "user_required_persona_inquiry" alter column "inquiry_id" type varchar(255) using ("inquiry_id"::varchar(255));'
    );
    this.addSql(
      'alter table "user_required_persona_inquiry" drop constraint if exists "user_required_persona_inquiry_purpose_check";'
    );
    this.addSql(
      'alter table "user_required_persona_inquiry" alter column "purpose" type text using ("purpose"::text);'
    );
    this.addSql(
      'alter table "user_required_persona_inquiry" add constraint "user_required_persona_inquiry_purpose_check" check ("purpose" in (\'Onboarding\'));'
    );
    this.addSql(
      'alter table "user_required_persona_inquiry" add constraint "user_required_persona_inquiry_inquiry_id_unique" unique ("inquiry_id");'
    );
    this.addSql(
      'alter table "user_required_persona_inquiry" add constraint "user_required_persona_inquiry_inquiry_id_foreign" foreign key ("inquiry_id") references "user_persona_inquiry" ("id") on update cascade;'
    );
  }
}

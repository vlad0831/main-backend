import { Migration } from '@mikro-orm/migrations';

export class Migration20211125102205 extends Migration {
  async up(): Promise<void> {
    const knex = this.getKnex();
    await this.execute(
      'alter table "management_workflow" drop constraint if exists "management_workflow_key_check";'
    );
    await this.execute(
      'alter table "management_workflow" alter column "key" type text using ("key"::text);'
    );
    await this.execute('DELETE FROM "user_management_workflow"');
    await this.execute('DELETE FROM "management_workflow"');
    await this.execute(
      'alter table "management_workflow" add constraint "management_workflow_key_check" check ("key" in (\'auto\', \'self\'));'
    );

    await this.execute(
      knex
        .insert(
          [
            {
              name: 'Auto',
              key: 'auto',
              description: '',
            },
            {
              name: 'Self Directed',
              key: 'self',
              description: '',
            },
          ],
          ['*']
        )
        .into('management_workflow')
    );
  }
}

import { Migration } from '@mikro-orm/migrations';

export class Migration20211019075509 extends Migration {
  async up(): Promise<void> {
    const knex = this.getKnex();
    await this.execute(
      knex
        .insert(
          [
            {
              name: 'Full Automation',
              key: 'Full',
              description: '',
            },
            {
              name: 'Partial Automation',
              key: 'Partial',
              description: '',
            },
            {
              name: 'Self Directed',
              key: 'Self',
              description: '',
            },
          ],
          ['*']
        )
        .into('management_workflow')
    );
  }

  async down(): Promise<void> {
    this.addSql('DELETE FROM management_workflow');
  }
}

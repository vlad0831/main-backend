import { Migration } from '@mikro-orm/migrations';

export class Migration20211104163223 extends Migration {
  async up(): Promise<void> {
    await this.execute(
      'alter table "user_recommended_portfolio" alter column "weight" type decimal;'
    );
    const knex = this.getKnex();
    await this.execute(
      knex
        .insert(
          [
            {
              name: 'factor',
              description: 'factor',
            },
            {
              name: 'equity',
              description: 'equity',
            },
            {
              name: 'values',
              description: 'values',
            },
            {
              name: 'commodity',
              description: 'commodity',
            },
            {
              name: 'gold',
              description: 'gold',
            },
            {
              name: 'real estate',
              description: 'real estate',
            },
            {
              name: 'innovation',
              description: 'innovation',
            },
            {
              name: 'cash',
              description: 'cash',
            },
            {
              name: 'fixed income',
              description: 'fixed income',
            },
            {
              name: 'blockchain',
              description: 'blockchain',
            },
          ],
          ['*']
        )
        .into('asset_class')
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user_recommended_portfolio" alter column "weight" type int4;'
    );
    this.addSql('delete from asset_class');
  }
}

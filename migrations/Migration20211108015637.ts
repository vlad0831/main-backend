import { Migration } from '@mikro-orm/migrations';

export class Migration20211108015637 extends Migration {
  async up(): Promise<void> {
    await this.execute('DELETE FROM user_investment_value');
    await this.execute('DELETE FROM investment_value');
    await this.execute('DELETE FROM user_investment_questionnaire_answer');
    await this.execute('DELETE FROM investment_questionnaire_option');
    await this.execute('DELETE FROM investment_questionnaire');
    await this.execute('DELETE FROM user_risk_level');
    await this.execute('DELETE FROM risk_level');
    const knex = this.getKnex();

    const result = await this.execute(
      knex
        .insert(
          [
            {
              name: 'investor level',
              question: 'How would you describe yourself as an investor?',
              category: 'Risk',
              order: 0,
            },
            {
              name: 'investment goal',
              question: 'What is your goal for investing with Allio?',
              category: 'Risk',
              order: 1,
            },
            {
              name: 'preferability of investment',
              question:
                'Are you passionate about investing in certain values or causes?',
              category: 'Value',
              order: 2,
            },
          ],
          ['*']
        )
        .into('investment_questionnaire')
    );

    await this.execute(
      knex
        .insert(
          [
            // Investor level
            {
              questionnaire_id: result[0].id,
              option: 'Newbie',
              description:
                'This is my first time investing but excited to get started',
              order: 0,
            },
            {
              questionnaire_id: result[0].id,
              option: 'Beginner',
              description:
                'I know the basics, but could definitely use some help',
              order: 1,
            },
            {
              questionnaire_id: result[0].id,
              option: 'Experienced',
              description:
                "I have a pretty good understanding of how markets work and I've invested before",
              order: 2,
            },
            {
              questionnaire_id: result[0].id,
              option: 'Expert',
              description:
                'I have a deep understanding of markets and investing',
              order: 3,
            },

            // Investment goal

            {
              questionnaire_id: result[1].id,
              option: 'Very Aggressive',
              description:
                'I am seeking high return potential and I am willing to accept more market risk',
              order: 0,
            },
            {
              questionnaire_id: result[1].id,
              option: 'Aggressive',
              description:
                'I am willing to weather market ups and downs to try an get higher returns',
              order: 1,
            },
            {
              questionnaire_id: result[1].id,
              option: 'Moderate',
              description:
                'I want to balance growth and stability of my money equally',
              order: 2,
            },
            {
              questionnaire_id: result[1].id,
              option: 'Conservative',
              description:
                'Still looking for growth but I tend to play it safe',
              order: 3,
            },
            {
              questionnaire_id: result[1].id,
              option: 'Very conservative',
              description:
                'Managing the volatility of my money is the priority over growth',
              order: 4,
            },

            // Preferability of investment

            {
              questionnaire_id: result[2].id,
              option: 'Minority Empowerment',
              description: '',
              order: 0,
            },
            {
              questionnaire_id: result[2].id,
              option: 'Gender Diversity',
              description: '',
              order: 1,
            },
            {
              questionnaire_id: result[2].id,
              option: 'Renewable Energy',
              description: '',
              order: 2,
            },
            {
              questionnaire_id: result[2].id,
              option: 'Clean water',
              description: '',
              order: 3,
            },
            {
              questionnaire_id: result[2].id,
              option: 'Spiritual',
              description: '',
              order: 4,
            },
          ],
          ['*']
        )
        .into('investment_questionnaire_option')
    );

    await this.execute(
      knex
        .insert([
          {
            risk_level: 0,
            description: 'Very conservative',
          },
          {
            risk_level: 1,
            description: 'Conservative',
          },
          {
            risk_level: 2,
            description: 'Moderate',
          },
          {
            risk_level: 3,
            description: 'Aggressive',
          },
          {
            risk_level: 4,
            description: 'Very aggressive',
          },
        ])
        .into('risk_level')
    );

    await this.execute(
      knex
        .insert(
          [
            {
              investment_value: 'NACP',
              description: 'Minority Empowerment',
            },
            {
              investment_value: 'SHE',
              description: 'Gender Diversity',
            },
            {
              investment_value: 'ICLN',
              description: 'Renewable Energy',
            },
            {
              investment_value: 'PHO',
              description: 'Clean Water',
            },
            {
              investment_value: 'BIBL',
              description: 'Spiritual',
            },
          ],
          ['*']
        )
        .into('investment_value')
    );
  }

  async down(): Promise<void> {
    await this.execute('DELETE FROM user_investment_value');
    await this.execute('DELETE FROM investment_value');
    await this.execute('DELETE FROM user_investment_questionnaire_answer');
    await this.execute('DELETE FROM investment_questionnaire_option');
    await this.execute('DELETE FROM investment_questionnaire');
    await this.execute('DELETE FROM user_risk_level');
    await this.execute('DELETE FROM risk_level');
    const knex = this.getKnex();

    const result = await this.execute(
      knex
        .insert(
          [
            {
              name: 'investor level',
              question: 'How would you describe yourself as an investor?',
              category: 'Risk',
              order: 0,
            },
            {
              name: 'investment goal',
              question: 'What is your goal for investing with Allio?',
              category: 'Risk',
              order: 1,
            },
            {
              name: 'preferability of investment',
              question:
                'Are you passionate about investing in certain values or causes?',
              category: 'Value',
              order: 2,
            },
          ],
          ['*']
        )
        .into('investment_questionnaire')
    );

    await this.execute(
      knex
        .insert(
          [
            // Investor level
            {
              questionnaire_id: result[0].id,
              option: 'Newbie',
              description:
                'This is my first time investing but excited to get started',
              order: 0,
            },
            {
              questionnaire_id: result[0].id,
              option: 'Beginner',
              description:
                'I know the basics, but could definitely use some help',
              order: 1,
            },
            {
              questionnaire_id: result[0].id,
              option: 'Experienced',
              description:
                "I have a pretty good understanding of how markets work and I've invested before",
              order: 2,
            },
            {
              questionnaire_id: result[0].id,
              option: 'Expert',
              description:
                'I have a deep understanding of markets and investing',
              order: 3,
            },

            // Investment goal

            {
              questionnaire_id: result[1].id,
              option: 'Very Aggressive',
              description:
                'I am seeking high return potential and I am willing to accept more market risk',
              order: 0,
            },
            {
              questionnaire_id: result[1].id,
              option: 'Aggressive',
              description:
                'I am willing to weather market ups and downs to try an get higher returns',
              order: 1,
            },
            {
              questionnaire_id: result[1].id,
              option: 'Moderate',
              description:
                'I want to balance growth and stability of my money equally',
              order: 2,
            },
            {
              questionnaire_id: result[1].id,
              option: 'Conservative',
              description:
                'Still looking for growth but I tend to play it safe',
              order: 3,
            },
            {
              questionnaire_id: result[1].id,
              option: 'Very conservative',
              description:
                'Managing the volatility of my money is the priority over growth',
              order: 4,
            },

            // Preferability of investment

            {
              questionnaire_id: result[2].id,
              option: 'Minority Empowerment (NAACP)',
              description: '',
              order: 0,
            },
            {
              questionnaire_id: result[2].id,
              option: 'Woman-led companies',
              description: '',
              order: 1,
            },
            {
              questionnaire_id: result[2].id,
              option: 'Gender Equality (LGBTQ+)',
              description: '',
              order: 2,
            },
            {
              questionnaire_id: result[2].id,
              option: 'Renewable Energy',
              description: '',
              order: 3,
            },
            {
              questionnaire_id: result[2].id,
              option: 'Clean water',
              description: '',
              order: 4,
            },
            {
              questionnaire_id: result[2].id,
              option: 'Spiritual / Biblical',
              description: '',
              order: 5,
            },
          ],
          ['*']
        )
        .into('investment_questionnaire_option')
    );

    await this.execute(
      knex
        .insert([
          {
            risk_level: 0,
            description: 'Very conservative',
          },
          {
            risk_level: 1,
            description: 'Conservative',
          },
          {
            risk_level: 2,
            description: 'Moderate',
          },
          {
            risk_level: 3,
            description: 'Aggressive',
          },
          {
            risk_level: 4,
            description: 'Very aggressive',
          },
        ])
        .into('risk_level')
    );
  }
}

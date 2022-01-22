import { Migration } from '@mikro-orm/migrations';

export class Migration20211109200701 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "asset_class" alter column "description" type text;'
    );
    this.addSql(
      'alter table "investment_questionnaire" alter column "name" type text, alter column "question" type text;'
    );
    this.addSql(
      'alter table "investment_questionnaire_option" alter column "option" type text, alter column "description" type text;'
    );
    this.addSql(
      'alter table "investment_value" alter column "description" type text;'
    );
    this.addSql(
      'alter table "management_workflow" alter column "name" type text, alter column "description" type text;'
    );
    this.addSql(
      'alter table "risk_level" alter column "description" type text;'
    );
    this.addSql(
      'alter table "s3_static_asset" alter column "description" type text, alter column "s3bucket" type text, alter column "s3tag" type text, alter column "s3region" type text;'
    );
    this.addSql(
      'alter table "static_asset_allocation" alter column "name" type text, alter column "description" type text;'
    );
    this.addSql(
      'alter table "text_static_asset" alter column "name" type text, alter column "description" type text;'
    );
    this.addSql(
      'alter table "user_investment_questionnaire_answer" alter column "answer" type text;'
    );
  }
}

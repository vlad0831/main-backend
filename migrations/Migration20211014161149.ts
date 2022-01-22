import { Migration } from '@mikro-orm/migrations';

export class Migration20211014161149 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "investment_questionnaire" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "question" varchar(255) not null, "category" text check ("category" in (\'Risk\', \'Value\')) not null, "order" int4 not null);');
    this.addSql('alter table "investment_questionnaire" add constraint "investment_questionnaire_pkey" primary key ("id");');
    this.addSql('alter table "investment_questionnaire" add constraint "investment_questionnaire_name_unique" unique ("name");');
    this.addSql('alter table "investment_questionnaire" add constraint "investment_questionnaire_question_unique" unique ("question");');

    this.addSql('create table "investment_questionnaire_option" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "questionnaire_id" uuid not null, "option" varchar(255) not null, "description" varchar(255) not null);');
    this.addSql('alter table "investment_questionnaire_option" add constraint "investment_questionnaire_option_pkey" primary key ("id");');
    this.addSql('alter table "investment_questionnaire_option" add constraint "investment_questionnaire_option_option_unique" unique ("option");');

    this.addSql('create table "user_investment_questionnaire_answer" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "questionnaire_id" uuid not null, "answer" varchar(255) null, "selected_option_id" uuid null);');
    this.addSql('alter table "user_investment_questionnaire_answer" add constraint "user_investment_questionnaire_answer_pkey" primary key ("id");');

    this.addSql('alter table "investment_questionnaire_option" add constraint "investment_questionnaire_option_questionnaire_id_foreign" foreign key ("questionnaire_id") references "investment_questionnaire" ("id") on update cascade;');

    this.addSql('alter table "user_investment_questionnaire_answer" add constraint "user_investment_questionnaire_answer_questionnaire_id_foreign" foreign key ("questionnaire_id") references "investment_questionnaire" ("id") on update cascade;');
    this.addSql('alter table "user_investment_questionnaire_answer" add constraint "user_investment_questionnaire_answer_selected_option_id_foreign" foreign key ("selected_option_id") references "investment_questionnaire_option" ("id") on update cascade on delete set null;');
  }

}

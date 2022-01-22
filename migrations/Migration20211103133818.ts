import { Migration } from '@mikro-orm/migrations';

export class Migration20211103133818 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_trade_customer" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "kyc_status" text check ("kyc_status" in (\'KYC_NOT_READY\', \'KYC_READY\', \'KYC_PROCESSING\', \'KYC_APPROVED\', \'KYC_INFO_REQUIRED\', \'KYC_DOC_REQUIRED\', \'KYC_MANUAL_REVIEW\', \'KYC_DENIED\')) not null, "kyc_errors" text[] not null default \'{}\', "customer_id" uuid not null);'
    );
    this.addSql(
      'alter table "user_trade_customer" add constraint "user_trade_customer_pkey" primary key ("id");'
    );

    this.addSql(
      'create table "user_kyc_physical_document" ("id" uuid not null default uuid_generate_v4(), "active" bool not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "user_id" uuid not null, "document_id" uuid not null, "type" text check ("type" in (\'DRIVER_LICENSE\', \'PASSPORT\', \'NATIONAL_ID_CARD\', \'VOTER_ID\', \'WORK_PERMIT\', \'VISA\', \'RESIDENCE_PERMIT\')) not null, "side" text check ("side" in (\'FRONT\', \'BACK\')) not null, "status" text check ("status" in (\'PENDING\', \'APPROVED\', \'REJECTED\')) not null);'
    );
    this.addSql(
      'alter table "user_kyc_physical_document" add constraint "user_kyc_physical_document_pkey" primary key ("id");'
    );
  }
}

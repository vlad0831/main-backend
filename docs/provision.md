# Provision

## Install Correct Node Version

[Install nvm](https://github.com/nvm-sh/nvm#installing-and-updating) if not yet installed

```sh
$ nvm use || nvm install
```

## Install pnpm package manager

```sh
npm i -g pnpm
```

## Install npm dependencies

```sh
$ pnpm install
```

## Environment Variables

- copy the `.env.example` file to `.env` and modify the permission

  ```sh
  cp .env.example .env
  chmod 640 .env
  ```

## Secrets

- create `secrets/`

  ```sh
  mkdir -p ./secrets;
  ```

- add secret key/value pairs, using `key` as filename and `value` as content.

  ```sh
  echo "client_id" > secrets/COGNITO_CLIENT_ID;
  echo "client_id" > secrets/PLAID_CLIENT_ID;
  echo "client_id" > secrets/PLAID_SECRET;
  echo "client_id" > secrets/PERSONA_WEBHOOK_INQUIRY_APPROVED_SECRET;
  echo "client_id" > secrets/PERSONA_WEBHOOK_INQUIRY_MARKED_FOR_REVIEW_SECRET;
  echo "client_id" > secrets/PERSONA_API_KEY;
  chmod 640 secrets/*
  ```

## PostgreSQL

- follow [postgresql setup on mac](https://www.sqlshack.com/setting-up-a-postgresql-database-on-mac/) to run the PostgreSQL service.
- go to PostgreSQL cli (replace `user` with the actual username created in the previous step)
  ```sh
  psql postgres -U user
  ```
- create `allio` database
  ```sql
  CREATE DATABASE allio;
  ```
- connect to `allio` database
  ```
  \c allio
  ```
- enable PostgreSQL uuid-ossp module function

  ```sql
  CREATE EXTENSION "uuid-ossp";
  ```

- modify the values of `MIKRO_ORM_USER` and `MIKRO_ORM_PASSWORD` accordinly in the `.env` file

```
MIKRO_ORM_USER = user
MIKRO_ORM_PASSWORD = password
```

## AWS Cognito

- follow [this article](https://medium.com/weekly-webtips/authentication-with-aws-cognito-and-nestjs-9f04c766f3fd) to find the config for `Allio-Backend` user pool in Allio's AWS Cognito account (in us-west-2).

- Replace the corresponding secrets and env variable values
  ```
  COGNITO_CLIENT_ID
  COGNITO_USER_POOL_ID
  COGNITO_REGION
  ```

## Persona

- Follow [this introduction](https://docs.withpersona.com/reference/introduction) to find the Persona API key.
- Follow [this section](https://docs.withpersona.com/docs/webhooks#checking-signatures) to find the corresponding Persona webhook secrets.
- Replace the corresponding secrets and env variable values
  ```
  PERSONA_WEBHOOK_INQUIRY_APPROVED_SECRET
  PERSONA_WEBHOOK_INQUIRY_MARKED_FOR_REVIEW_SECRET
  PERSONA_API_KEY
  ```

## FAQ

- Peer authentication error when logging in psql
  - https://gist.github.com/AtulKsol/4470d377b448e56468baef85af7fd614

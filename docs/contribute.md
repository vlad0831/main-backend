# Contribute

## Use Correct Node Version

[Install nvm](https://github.com/nvm-sh/nvm#installing-and-updating) if not yet installed

```sh
$ nvm use || nvm install
```

## Running the app in development mode

```sh
# development
$ pnpm start

# watch mode
$ pnpm start:dev
```

## Test

```sh
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```

## Api Document

- Use interactive api document at http://localhost:3000/docs to test the api endpoints.
- Use GraphQL Studio at http://localhost:3000/graphql to test the GraphQL resolvers.
- Use `docs/graphQL-query` to document any example graphql query for frontend developers to reference.

## Database Migration

[Migration](./migration.md)

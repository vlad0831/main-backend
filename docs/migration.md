# Migration

## Create Migration Script

- Migration script should be created when there are changes to the entity files (`src/**/*.entity.ts`)
- Automatically create migration script by running
  ```sh
  pnpm migration:create
  ```
- Verify that new migration js file (`dist/migrations/Migration*.js`) is created

## Run Migration Script

- Migration script should be run manually to update the table schema of the database.
- Make sure the migration js files in `dist/migrations/` have 1 to 1 relationship to the ts files in `migrations/`; if not, run the compiler again
  ```sh
  pnpm migration:compile
  ```
- To up the version of migration script, run
  ```sh
  pnpm migration:up
  ```

## Down Migration Version

- This is not recommended and all migration should be backward compatible!
- Down migration need to be manually implemented
- add a `down` method to the migration class in the migration ts file in `migrations/`
- compile the migration ts files to js files in `dist/migrations/`
  ```sh
  npx swc migrations -d ./dist/migrations
  ```
- to down the version of migration, run
  ```sh
  npx mikro-orm migration:down
  ```

## Reference

- [Mikro-orm](https://mikro-orm.io/docs/migrations/)

# Postgres

## Local Postgres Server

1. install podman

2. create a podman volume

   ```sh
   podman volume create my_postgres
   ```

3. create an env file `.env.postgres` (change the variables accordingly)

   ```
   POSTGRES_DB=allio
   POSTGRES_USER=[USERNAME]
   POSTGRES_PASSWORD=[PASSWORD]
   ```

4. create a postgres v.10.14 (equivalent to the AWS Aurora DB postgres version) podman container

   ```sh
   podman run -d --name dev_postgres -v my_postgres:/var/lib/postgresql/data -p 5432:5432 --env-file ./.env.postgres postgres:10.14
   ```

## Stop Postgres Podman Container

- stop the container when not used
  ```sh
  podman stop dev_postgres
  ```

## Resume Postgres Podman Container

- resume the container when needed
  ```sh
  podman start dev_postgres
  ```

## Postgres Client

### psql

1. install libpq using brew

   ```sh
   brew install libpq
   ```

2. add the following to the `~/.zshrc`

   ```sh
   # link postgress lib
   # libpq in PATH
   export PATH="/opt/homebrew/opt/libpq/bin:$PATH"
   # compilers to find libpq
   export LDFLAGS="-L/opt/homebrew/opt/libpq/lib"
   export CPPFLAGS="-I/opt/homebrew/opt/libpq/include"
   # pkg-config to find libpq
   export PKG_CONFIG_PATH="/opt/homebrew/opt/libpq/lib/pkgconfig"
   ```

### Pgadmin4

1. or, alternatively, install pgadmin4

   ```sh
   brew install --cask pgadmin4
   ```

## Provision Steps after Postgres Server Creation

1. connect to the allio database using postgres client; here is the example for psql

   ```sh
   psql -h localhost -p 5432 -d allio -U alliobackend
   ```

2. enable PostgreSQL uuid-ossp module function

   ```sql
   CREATE EXTENSION "uuid-ossp";
   ```

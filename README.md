# fampi

## Requirements
* Postgres 9.5 or later
* Node 7.6.0 or later

## Setup
1. Run: `npm i`
2. Create a postgres database named 'fampi-dev' with the citext extension enabled.
3. Create a .env file in the root with the database settings:
```
DB_USER=
DB_PASS=
DB_HOST=localhost
DB_PORT=5433
DB_NAME=fampi-dev
```
4. Run: `npm run migrate migrate`
5. Run: `npm start`

## Migrations
Uses pure sql files, courtesy of [sql-migrations](https://github.com/dmitriiabramov/node-sql-migrations), invoke with:
* `npm run migrate migrate` # runs all migrations not allready in the database 
* `npm run migrate rollback` # rollbacks the latest migration
* `npm run migrate create <migration_name>` # generate new migration sql files in the [./migrations](./migrations) folder. 

import path from 'path'
import sqlMigrations from 'sql-migrations'
import config from '../src/config'

sqlMigrations.run({
  basedir: config.rootPath,
  migrationsDir: path.resolve(config.rootPath, 'migrations'),
  user: config.database.user,
  host: config.database.host,
  port: config.database.port,
  password: config.database.password,
  db: config.database.database
})

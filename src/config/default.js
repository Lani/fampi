import path from 'path'

const rootPath = path.resolve(__dirname, '../../')
const environment = process.env.NODE_ENV || 'development'

export default {
  development: environment === 'development',
  environment: environment,
  rootPath: rootPath,
  log: {
    path: process.env.NODE_LOG_PATH || path.resolve(rootPath, 'logs'),
    level: process.env.NODE_LOG_LEVEL || 'info',
    morganFormat: process.env.NODE_MORGAN_FORMAT || 'combined'
  },
  server: {
    port: process.env.NODE_PORT || 3001,
    host: process.env.NODE_HOST || '0.0.0.0'
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'fampi',
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  }
}

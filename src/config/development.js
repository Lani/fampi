// Overrides configuration parameters set in './default.js'.
export default {
  log: {
    level: 'debug',
    morganFormat: 'dev'
  },
  database: {
    database: process.env.NODE_DB_NAME || 'fampi-dev'
  }
}

import bluebird from 'bluebird' // Faster and more features than the V8 implementation.
import pgp from 'pg-promise'
import config from 'config'

const pgpInstance = pgp({ promiseLib: bluebird })
export default pgpInstance(config.database)

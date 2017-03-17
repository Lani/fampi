import pgp from 'pg-promise'
import config from '/config'

const pgpInstance = pgp()

export default pgpInstance(config.database)

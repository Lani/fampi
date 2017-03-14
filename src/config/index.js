import _ from 'lodash'
import fs from 'fs'

import defaults from './default.js'

const path = `./${process.env.NODE_ENV || 'development'}.js`
const config = fs.existsSync(path) ? require(path) : {}

export default _.merge({}, defaults, config)

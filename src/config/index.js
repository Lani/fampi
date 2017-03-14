import path from 'path'
import fs from 'fs'
import defaults from './default.js'

const configPath = path.resolve(__dirname, `${defaults.environment}.js`)
const config = fs.existsSync(configPath) ? require(configPath).default : {}
export default Object.assign({}, defaults, config)

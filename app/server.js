import bodyParser from 'koa-bodyparser'
import Koa from 'koa'
import logger from 'koa-logger'
import helmet from 'koa-helmet'

import config from './config'

const app = new Koa()

app
  .use(logger())
  .use(bodyParser())
  .use(helmet())

// routing(app)

app.listen(config.port, () => console.log(`API running at http://localhost:${config.port}/`))

export default app

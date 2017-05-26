import express from 'express'
import log from 'log'
import config from 'config'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import auth from './auth/index'
import respondMiddleware from './base/respondMiddleware'
import restful from 'restful'

const app = express()

app.use(morgan(config.log.morganFormat, { stream: { write: message => log.info(message.trim()) } }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(respondMiddleware())
app.use(auth.initialize())

restful.configure(app, {
  dirname: __dirname
})

app.get('*', (req, res) => res.respond.notFound())

// Generic server errors (e.g. not caught by components)
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  res.respond.error(err)
})

app.listen(config.server.port, config.server.host, err => {
  if (err) {
    log.error(err)
    return
  }
  log.info(`API available at http://${config.server.host}:${config.server.port}`)
})

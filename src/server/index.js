
import express from 'express'
import log from 'lib/log'
import config from 'config'
import morgan from 'morgan'

const app = express()

app.use(morgan(config.log.morganFormat, {'stream': {write: message => log.info(message.trim())}}))

// Generic server errors (e.g. not caught by components)
app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
  log.error('Error on request ', req.method, req.url)
  log.error(err.stack)

  let message = 'Oh no! We were overrun by goblins!'
  if (config.development) {
    message += '<p>' + err.stack.replace('\n', '<br>')
  }
  res.status(500).send(message)
})

app.listen(config.server.port, config.server.host, (err) => {
  if (err) {
    log.error(err)
    return
  }
  log.info(`API available at http://${config.server.host}:${config.server.port}`)
})

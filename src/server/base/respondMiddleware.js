import log from 'log'
import config from 'config'

export class Responder {
  constructor (req, res) {
    this.res = res
    this.req = req
  }

  get reasons () {
    return {
      success: 200,
      created: 201,
      accepted: 202,
      noContent: 204,
      badRequest: 400,
      unauthorized: 401,
      forbidden: 403,
      notFound: 404,
      internalServerError: 500
    }
  }

  sendJson (reason, data) {
    return this.res.status(reason).json(data)
  }

  noContent () {
    return this.res.sendStatus(this.reasons.noContent)
  }

  success (data) {
    return this.sendJson(this.reasons.success, data)
  }

  notFound (message = 'resource not found') {
    return this.sendJson(this.reasons.notFound, { error: { message: message } })
  }

  badRequest (message) {
    log.debug('Bad request', this.req.method, this.req.originalUrl, message)
    return this.sendJson(this.reasons.badRequest, { error: { message: message } })
  }

  unauthorized (err) {
    let message = err.message ? err.message : err
    log.debug('Unauthorized', this.req.method, this.req.originalUrl, message)
    if (message !== err) log.debug(err)

    const error = { message: message }
    if (config.development && message !== err) {
      error.debug = err
    }
    this.sendJson(this.reasons.unauthorized, { error: error })
  }

  error (err) {
    try {
      log.error('Error on request', this.req.method, this.req.originalUrl, err.message)
      log.error(err.stack)

      const error = {
        message: err.message
      }
      if (config.development) {
        error.stack = err.stack.split('\n')
        error.errors = err.errors
      }
      this.sendJson(err.responseCode || this.reasons.internalServerError, { error: error })
    } catch (e) {
      this.res.status(500).send(e)
      log.error('Error processing error', e)
    }
  }
}

export default () => (req, res, next) => {
  res.respond = new Responder(req, res)
  next()
}

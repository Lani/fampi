import log from 'log'
import config from 'config'

class Responder {
  constructor (res, req) {
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

  send (reason, data) {
    this.res.status(reason).json(data)
  }

  noContent () {
    this.res.sendStatus(this.reasons.noContent)
  }

  success (prefix, data) {
    this.send(this.reasons.success, { [prefix]: data })
  }

  notFound (message) {
    this.send(this.reasons.notFound, { error: { message: message } })
  }

  badRequest (message) {
    log.debug('Bad request ', this.req.method, this.req.originalUrl, message)
    this.send(this.reasons.badRequest, { error: { message: message } })
  }

  unauthorized (err) {
    log.debug('Error on request ', this.req.method, this.req.originalUrl)
    if (err.stack) log.debug(err.stack)
    if (err.message) log.debug(err.message)
    else log.debug(err)

    const error = { message: err.message ? err.message : err }
    if (config.development) {
      error.debug = err
    }
    this.send(this.reasons.unauthorized, { error: error })
  }

  error (err) {
    log.error('Error on request ', this.req.method, this.req.originalUrl)
    log.error(err.message)
    log.error(err.stack)

    const error = { message: err.message }
    if (config.development) {
      error.debug = err
    }
    this.send(this.reasons.internalServerError, { error: error })
  }
}

export default () => (req, res, next) => {
  res.respond = new Responder(res, req)
  next()
}

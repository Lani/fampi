// logger, inspired by https://github.com/DispatchMe/logstar

import winston from 'winston'
import _ from 'lodash'
import config from 'config'
import path from 'path'
import { argumentsToString } from './format'
import Moment from 'moment'
import winstonCommon from 'winston/lib/winston/common'

winston.emitErrs = true

// Override to use real console.log etc for VSCode debugger
winston.transports.Console.prototype.log = function (level, message, meta, callback) {
  const output = winstonCommon.log(
    Object.assign({}, this, {
      level,
      message,
      meta
    })
  )

  console[level in console ? level : 'log'](output)

  setImmediate(callback, null, true)
}

const winstonInstance = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: config.log.level,
      filename: path.join(config.rootPath, 'logs', `${config.environment}.log`),
      handleExceptions: true,
      json: false,
      maxsize: 104857600, // 100 MB
      maxFiles: 14,
      colorize: false,
      timestamp: () => new Moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
    }),
    new winston.transports.Console({
      level: config.log.level,
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
})

winstonInstance.isLevelEnabled = level => {
  return _.any(
    this.transports,
    function (transport) {
      return (
        (transport.level && this.levels[transport.level] <= this.levels[level]) ||
        (!transport.level && this.levels[this.level] <= this.levels[level])
      )
    },
    this
  )
}

function log (level, ...args) {
  if (winstonInstance) {
    winstonInstance.log(level, ...args)
  } else if (console[level]) {
    console[level](...args)
  } else {
    console.log(level, ...args)
  }
}

function wrapLog (level) {
  return (...args) => {
    log(level, argumentsToString(args))
  }
}

export default {
  debug: wrapLog('debug'),
  info: wrapLog('info'),
  warn: wrapLog('warn'),
  error: wrapLog('error'),
  fatal: wrapLog('fatal'),
  log: log,
  isLevelEnabled: winstonInstance.isLevelEnabled,
  winstonInstance: winstonInstance // I would rather not make this public, but for now I'm using the express-winston middleware, that needs this instance.
}

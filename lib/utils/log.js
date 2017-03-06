// Universal logger, inspired by https://github.com/DispatchMe/logstar

// todo: Move settings like active log levels, maxsize, maxFiles, etc. to configuraiton file.

import winston from 'winston'
import _ from 'lodash'
import path from 'path'

import settings from '../settings'
import { argumentsToString } from './format'

let winstonLogger = null

if (winston.Logger) {
  // On server, use winston. Winston removed on client by browser directive in package.json.

  winston.emitErrs = true
  const env = process.env.NODE_ENV || 'development'
  const logLevel = env === 'development' ? 'debug' : 'info'

  winstonLogger = new winston.Logger({
    transports: [
      new winston.transports.File({
        level: logLevel,
        filename: path.join(settings.rootPath, 'logs', `${env}.log`),
        handleExceptions: true,
        json: false,
        maxsize: 104857600, // 100 MB
        maxFiles: 14,
        colorize: false
      }),
      new winston.transports.Console({
        level: logLevel,
        handleExceptions: true,
        json: false,
        colorize: true
      })
    ],
    exitOnError: false
  })

  winstonLogger.isLevelEnabled = (level) => {
    return _.any(this.transports, function (transport) {
      return (transport.level && this.levels[transport.level] <= this.levels[level]) ||
        (!transport.level && this.levels[this.level] <= this.levels[level])
    }, this)
  }
}

function log (level, ...args) {
  if (winstonLogger) {
    winstonLogger.log(level, ...args)
  } else if (console[level]) {
    console[level](...args)
  } else {
    console.log(level, ...args)
  }
}

function logger (level) {
  return (...args) => {
    log(level, argumentsToString(args))
  }
}

// export const winstonInstance = winstonLogger
export default {
  debug: logger('debug'),
  info: logger('info'),
  warn: logger('warn'),
  error: logger('error'),
  fatal: logger('fatal')
}

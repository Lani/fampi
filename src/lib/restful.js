/*
  Original idea and code from https://github.com/mench/express-restful-es6
*/

import { Router } from 'express'
import http from 'http'
import { Responder } from 'server/base/respondMiddleware'
import requireAll from 'require-all'

const methods = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'use'
]

const routers = []
const middlewareProperty = '__middleware__' // Using a string could colide, but is faster than a Symbol.
const globalMiddlewareKey = '__globalMiddlewareKey__'

class Handler {
  constructor (Class) {
    this.resource = new Class()
  }

  handle (req, res, next, methodName) {
    const self = this
    this.respond = res.respond || new Responder(req, res)

    const args = Object.keys(req.params).map(k => req.params[k])
    args.push(req)
    args.push(res)
    args.push(next)

    const promise = new Promise((resolve, reject) => {
      try {
        resolve(self.resource[methodName].apply(self.resource, args))
      } catch (e) {
        reject(e)
      }
    })
    promise.then(result => {
      if (result instanceof http.ServerResponse) {
        return
      }
      if (result instanceof Error) {
        self.respond.error(result)
      } else if (typeof result !== 'undefined' && result != null) {
        self.respond.success(result)
      } else if (result == null && typeof result === 'object') {
        self.respond.notFound()
      }
    }).catch(err => {
      self.respond.error(err)
    })
  }

  getClass () {
    return this.resource.constructor
  }
}

export function middleware (method) {
  if (!method || !(method instanceof Function)) {
    throw new Error('middleware must be Function')
  }
  return (self, key, descriptor) => {
    if (!key) {
      key = globalMiddlewareKey
    }

    if (!self.prototype[middlewareProperty]) {
      self.prototype[middlewareProperty] = {}
    }
    if (!self.prototype[middlewareProperty][key]) {
      self.prototype[middlewareProperty][key] = []
    }
    self.prototype[middlewareProperty][key].push(method)
  }
}

export function rest (url) {
  return (Class, key, descriptor) => {
    if (typeof Class !== 'function') {
      throw new Error('must be class not a prop..')
    }
    const router = Router()
    const handler = new Handler(Class)

    Object.getOwnPropertyNames(Class.prototype).forEach((property) => {
      if (!(handler.resource[property] instanceof Function)) return

      let methodUrl, action
      const methodFound = methods.some((method) => {
        if (property === method) {
          methodUrl = url
          action = method
          return true
        } else if (property.startsWith(method)) {
          action = method
          let param = property.slice(method.length)
          param = `${param.charAt(0).toLowerCase()}${param.slice(1)}`
          methodUrl = `${url}/:${param}`
          return true
        }
      })

      if (!methodFound) return

      const allMiddlewares = Class.prototype[middlewareProperty]
      let middlewares = allMiddlewares ? allMiddlewares[property] || [] : [] // method specific middleware(s)
      if (allMiddlewares && allMiddlewares[globalMiddlewareKey]) {
        middlewares = allMiddlewares[globalMiddlewareKey].concat(middlewares) // class global middleware(s)
      }
      router[action](methodUrl, middlewares, (req, res, next) => {
        handler.handle(req, res, next, property)
      })
    })
    routers.push(router)
  }
}

export default class Restful {
  static configure (app, {dirname}) {
    requireAll({
      dirname: dirname,
      filter: /.*[Rr]outes\.js$/,
      excludeDirs: /^\.(git|svn)$/,
      recursive: true
    })
    // Each use of the @rest decorator adds the decorated class to the
    // routers list when the modules are required above.
    routers.forEach(router => { app.use(router) })
  }
}

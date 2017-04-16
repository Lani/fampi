import passport from './index'
import userModel from '../users/userModel'
import { rest } from 'restful'

@rest('/auth/session')
export class AuthSessionRouter {
  post (req, res, next) {
    passport.authenticate((err, user, info) => {
      if (err) res.error(err)
      if (!user) res.respond.notFound('User not found')
      if (user) {
        req.logIn(user, function (err) {
          if (err) res.error(err)
          res.respond.success({ user: user })
        })
      }
    })(req, res, next)
  }

  delete (req, res) {
    req.logout()
    res.respond.noContent()
  }
}

@rest('/auth/register')
export class AuthRegisterRouter {
  async post (req, res, next) {
    await userModel.create(req.body)
    passport.authenticate((err, user, info) => {
      if (user) res.respond.success({ user: user })
      if (err) res.respond.unauthorized(err)
    })(req, res, next)
  }
}

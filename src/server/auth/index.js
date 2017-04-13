import passport from 'passport'
import session from 'express-session'
import { Strategy as LocalStrategy } from 'passport-local'
import nodeify from 'nodeify'

import config from 'config'
import User from '../users/userModel'
import cors from './cors'
import crypt from './crypt'

passport.use(new LocalStrategy({
  usernameField: 'email'
}, (email, password, callback) => {
  nodeify((async () => {
    if (!email) return [false, {message: 'Invalid email.'}]

    let user = await User.getByEmail(email)
    if (!user) return [false, {message: 'Invalid email and password combination.'}]

    if (!await crypt.validatePassword(password, user.password_digest)) {
      return [false, {message: 'Invalid email and password combination.'}]
    }
    user.password_digest = undefined
    return user  // Return value will be set to req.user
  })(), callback, {spread: true})
}))

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  nodeify((async () => {
    return await User.getById(id)
  })(), done)
})

export default class {
  static initialize () {
    return [cors(), session({ secret: config.authentication.sessionKey, resave: false, saveUninitialized: false }),
      passport.initialize(), passport.session()]
  }

  static authenticate (callback) {
    return passport.authenticate('local', { session: true }, callback)
  }

  static loginRequired (req, res, next) {
    if (!req.user) return res.respond.unauthorized('Please log in')
    return next()
  }
}

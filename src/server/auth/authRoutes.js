import { Router } from 'express'

import passport from './index'
import wrap from 'wrap'
import userModel from '../users/userModel'

const router = Router()

router.post('/register', wrap(async (req, res, next) => {
  try {
    await userModel.create(req.body)
  } catch (ex) {
    if (ex.constraint === 'users_email_key') {
      res.respond.badRequest(`The email ${req.body.email} is allready registered.`)
      return
    }
    throw ex
  }
  passport.authenticate((err, user, info) => {
    if (user) res.respond.success('user', user)
    if (err) res.respond.unauthorized(err)
  })(req, res, next)
}))

router.post('/login', (req, res, next) => {
  passport.authenticate((err, user, info) => {
    if (err) res.error(err)
    if (!user) res.respond.notFound('User not found')
    if (user) {
      req.logIn(user, function (err) {
        if (err) res.error(err)
        res.respond.success('user', user)
      })
    }
  })(req, res, next)
})

router.get('/logout', (req, res, next) => {
  req.logout()
  res.respond.noContent()
})

export default router

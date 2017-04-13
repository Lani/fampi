import {Router} from 'express'
import User from './userModel'
import wrap from 'wrap'
import auth from 'server/auth'

const router = new Router()

router.get('/', auth.loginRequired, wrap(async (req, res) => {
  res.respond.success('users', await User.all())
}))

router.get('/:id', auth.loginRequired, wrap(async (req, res) => {
  res.respond.success('user', await User.getById(parseInt(req.params.id)))
}))

router.post('/', auth.loginRequired, wrap(async (req, res) => {
  res.respond.success('user', await User.create(req.body))
}))

export default router

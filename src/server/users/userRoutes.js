import {Router} from 'express'
import User from './userModel'
import wrap from 'wrap'

const router = new Router()

router.get('/', wrap(async (req, res) => {
  res.status(200).json(await User.all())
}))

export default router

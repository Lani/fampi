import User from './userModel'
import auth from 'server/auth'
import { rest, middleware } from 'restful'

@rest('/users')
@middleware(auth.loginRequired)
export class UserRoutes {
  async get () {
    return { users: await User.all() }
  }

  async getId (id) {
    return { user: await User.getById(parseInt(id)) }
  }

  async post (req) {
    return { user: await User.create(req.body) }
  }
}

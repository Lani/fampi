import db from 'lib/db'
import crypt from 'server/auth/crypt'

export default class UserModel {
  static async all () {
    return await db.any('select id, email, username from users')
  }

  static async getById (id) {
    return await db.one('select id, email, username from users where id=$1', id)
  }

  static async getByEmail (email) {
    return await db.one('select id, email, username, password_digest from users where email=$1', email)
  }

  static async create (user) {
    let digest = await crypt.generateDigest(user.password)
    try {
      return await db.one('insert into users(email, username, password_digest) values($(email), $(username), $(password_digest)) returning id, email, username',
      { email: user.email, username: user.username, password_digest: digest })
    } catch (ex) {
      if (ex.constraint === 'users_email_key') {
        throw new Error(`The email ${user.email} is allready registered.`)
      }
      throw ex
    }
  }
}

import ValidationError from 'errors/validationError'
import NoResultError from 'errors/noResultError'
import db from 'lib/db'
import crypt from 'server/auth/crypt'
import convertToClass from 'lib/utils/convertToClass'
import UserModel from 'server/users/userModel'

const duplicateKeyRegex = /^Key \((\w*)\).*$/

export default class UserFacade {
  static async all () {
    return await db.any('select id, email, username from users')
  }

  static async getById (id) {
    let user = await db.oneOrNone('select id, email, username from users where id=$1', id)
    if (!user) {
      throw new NoResultError('User not found')
    }
    return user
  }

  static async getByEmail (email) {
    return await db.one('select id, email, username, password_digest from users where email=$1', email)
  }

  static async create (user) {
    const userModel = convertToClass(user, UserModel)
    await userModel.validate()
    const digest = await crypt.generateDigest(user.password)
    try {
      return await db.one(
        'insert into users(email, username, password_digest) values($(email), $(username), $(password_digest)) returning id, email, username',
        { email: user.email, username: user.username, password_digest: digest }
      )
    } catch (ex) {
      if (ex.message.startsWith('duplicate key value violates unique constraint')) {
        let match = duplicateKeyRegex.exec(ex.detail)
        if (!match) {
          throw new ValidationError('Validation error', { '': ex.detail }, ex)
        }
        throw new ValidationError('Validation error', { [match[1]]: 'Does already exists.' })
      }
      throw ex
    }
  }
}

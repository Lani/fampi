import db from 'lib/db'

export default class UserModel {
  static async all () {
    return await db.any('select id, email, username from users')
  }
}

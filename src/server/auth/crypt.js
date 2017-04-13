import bcrypt from 'bcrypt'

export default class {
  static async generateDigest (password) {
    return await bcrypt.hash(password, 10)
  }

  static async validatePassword (password, digest) {
    return await bcrypt.compare(password, digest)
  }
}

/*
import DuplicateResourceError from 'errors/duplicateResourceError'
import NoResultError from 'errors/noResultError'
import db from 'lib/db'
import crypt from 'server/auth/crypt'
*/
import { field } from 'model/field'

export default class UserModel {
  @field('string', 'required', 'maxLength:50')
  username = null

  @field('email', 'required', 'maxLength:254', 'email')
  email = null

  @field('password', 'required')
  password = null
}

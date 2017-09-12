import { field, types as t } from 'model/field'

export default class UserModel {
  @field(t.string, 'required', 'maxLength:50')
  username = null

  @field(t.email, 'required', 'maxLength:254', 'email')
  email = null

  @field(t.password, 'required')
  password = null
}

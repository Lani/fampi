import Checkit from 'checkit'

import getClassName from 'utils/getClassName'
import ValidationError from 'errors/validationError'

export const fieldsProperty = Symbol('fields')
export const validationsProperty = Symbol('validations')

export default class Model {
  constructor () {
    this[fieldsProperty] = {}
    this[validationsProperty] = {}
  }

  async validate (fieldName) {
    let appliedValidations = this[validationsProperty]
    if (!appliedValidations) {
      throw new Error(`There are no validation rules defined on the '${getClassName(this)}' class.`)
    }
    if (fieldName) {
      appliedValidations = appliedValidations[fieldName]
      if (!appliedValidations) {
        throw new Error(
          `No validation rules defined for the field '${fieldName}', on the class '${getClassName(this)}'.`
        )
      }
    }
    try {
      await new Checkit(appliedValidations).validate(this)
    } catch (ex) {
      throw new ValidationError(ex.message, ex.errors, ex)
    }
  }

  toJSON () {
    let copy = {}
    let fields = this[fieldsProperty]

    for (var prop in this) {
      if (!fields[prop.isBlacklisted]) {
        copy[prop] = this[prop]
      }
    }
    return copy
  }
}

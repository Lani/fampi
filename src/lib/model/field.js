// import ValidationError from 'errors/validationError'
// import getClassName from 'utils/getClassName'
// import Checkit from 'checkit'
import Model, { validationsProperty, fieldsProperty, types } from './model'
/*
async function validate (fieldName) {
  let fields = this[fieldsProperty]
  if (!fields) {
    throw new Error(`There are no validation rules defined on the '${getClassName(this)}' class.`)
  }
  let field = {}
  if (fieldName) {
    field[fieldName] = fields[fieldName]
    if (!field) {
      throw new Error(`No validation rules defined for the '${fieldName}' field on the '${getClassName(this)}' class.`)
    }
  } else {
    field = fields
  }
  try {
    console.log('validations', field.validations)
    await new Checkit(field.validations).validate(this)
  } catch (ex) {
    throw new ValidationError(ex.message, ex.errors, ex)
  }
  // validateObject(this, validations)
}
*/
/*
function validateObject (object, validations) {
  const objectErrors = {}
  Object.keys(validations).forEach(validationPropertyName => {
    var propertyErrors = validateProperty(
      object,
      validationPropertyName,
      object[validationPropertyName],
      validations[validationPropertyName]
    )
    if (propertyErrors) {
      objectErrors[validationPropertyName] = propertyErrors
    }
  })
  if (Object.keys(objectErrors).length > 0) {
    throw new ValidationError(objectErrors)
  }
}

function validateProperty (containingObject, propertyName, propertyValue, rules) {
  const propertyErrors = {}
}

const ruleDefinitions = {
  required: function (object, name, value) {
    return value != null && ('' + value).trim() !== ''
  },
  email: function (object, name, value) {
    return /^.+@.+\..+$/.test(value)
  },
  minLength: function (val, length) {
    return verifyInt(length) || val.length >= length
  },
  maxLength: function (val, length) {
    return verifyInt(length) || val.length <= length
  }
}

function verifyInt (val) {
  if (!Number.isInteger(val)) {
    throw new Error('The validator argument must be a valid integer')
  }
}
*/

/**
* @function field Defines a field on the model.
* @param  {string} type The field type. @see ./types for supported types.
* @param  {arguments} ...args Validation rules. @see {@link https://github.com/tgriesser/checkit} for supported validation rules.
* @return {function} The field descriptor implementation applied when the model is parsed.
*/
export function field (type, ...args) {
  return (target, key, descriptor) => {
    addField(target, key, type, ...args)
  }
}

//  let validations = args || ['required', 'matchesField:passwordConfirmation', 'minLength:8', 'maxLength:50']

/**
* @function blacklist Blacklist a field/property from being returned when serialized to Json.
*/
export function blacklist () {
  return (target, key, descriptor) => {
    blacklistField(target, key)
  }
}

/**
* @function instanceOnly Not stored in the database.
*/
export function instanceOnly () {
  return (target, key, descriptor) => {
    instanceOnlyField(target, key)
  }
}

function addField (target, key, type, ...args) {
  if (!(target instanceof Model)) {
    throw new Error('The field decorator can only be applied on the Model class.')
  }
  let field = (getField(target, key).type = type)
  target[validationsProperty][key] = args
  return field
}

function blacklistField (target, key) {
  getField(target, key).isBlacklisted = true
}

function instanceOnlyField (target, key) {
  getField(target, key).isInstanceOnly = true
}

function getField (target, key) {
  return (target[fieldsProperty][key] = target[fieldsProperty][key] || {})
}

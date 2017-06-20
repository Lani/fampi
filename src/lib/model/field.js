const fieldsProperty = '__fields__' // Using a string could collide, but is faster than a Symbol.
import ValidationError from 'errors/validationError'
import getClassName from 'utils/getClassName'
import Checkit from 'checkit'

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
export function field (type, ...args) {
  return (target, key, descriptor) => {
    let fields = target[fieldsProperty]
    if (!fields) {
      fields = target[fieldsProperty] = { fields: {}, validations: {} }
      target.validate = validate
    }
    fields.fields[key] = { type: type }
    fields.validations[key] = args
  }
}

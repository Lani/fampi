import ExtendibleError from './extendibleError'

export default class ValidationError extends ExtendibleError {
  constructor (message, errors, innerError) {
    super(message, innerError)
    this.errors = errors
    this.responseCode = 400
  }
}

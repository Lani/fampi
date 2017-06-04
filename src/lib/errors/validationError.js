import ExtendibleError from './extendibleError'

export default class ValidationError extends ExtendibleError {
  constructor (message) {
    super(message)
    this.responseCode = 400
  }
}

import ExtendibleError from './extendibleError'

export default class DuplicateResourceError extends ExtendibleError {
  constructor (message) {
    super(message)
    this.responseCode = 409
  }
}

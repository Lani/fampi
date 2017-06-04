import ExtendibleError from './extendibleError'

export default class NoResultError extends ExtendibleError {
  constructor (message) {
    super(message || 'not found')
    this.responseCode = 404
  }
}

export default class ExtendableError extends Error {
  constructor (message, innerError) {
    super()
    this.message = message
    this.innerError = innerError
    // this.stack = (new Error()).stack;
    this.name = this.constructor.name
  }
}

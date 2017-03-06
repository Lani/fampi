import util from 'util'

// Pass in function arguments object and returns string with whitespaces.
// Credits: https://github.com/DispatchMe/logstar
export function argumentsToString (v) {
  // convert arguments object to real array
  const args = Array.prototype.slice.call(v)
  for (const k in args) {
    if (typeof args[k] === 'object') {
      if (util.inspect) {
        args[k] = util.inspect(args[k], false, null, true)
      } else {
        args[k] = JSON.stringify(args[k])
      }
    }
  }

  const str = args.join(' ')
  return str
}

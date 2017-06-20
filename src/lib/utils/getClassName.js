// https://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
export default function getClassName (object) {
  let funcNameRegex = /function (.{1,})\(/
  let results = funcNameRegex.exec(object.constructor.toString())
  return results && results.length > 1 ? results[1] : ''
}

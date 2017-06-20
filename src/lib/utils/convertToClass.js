export default function (object, Class) {
  return Object.assign(new Class(), object)
}

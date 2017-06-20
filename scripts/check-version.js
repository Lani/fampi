var semver = require('semver')
var engines = require('../package').engines
var version = engines.node

if (!semver.satisfies(process.version, version)) {
  console.log(`Required node version ${version} not satisfied with current version ${process.version}.\n`)
  process.exit(1)
}

// I've had problems getting dotenv to load evironment settings before all imports.
// To be more flexible I made this preload that registers babel and then dotenv.
// This can then be preloaded by node with the -r switch:
// node -r ./scripts/preload.js <script to run>
global.Promise = require('bluebird')
require('babel-runtime/core-js/promise').default = require('bluebird')
require('babel-register')
require('dotenv').config({silent: true})

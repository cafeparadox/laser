'use strict'

const nconf = require('nconf')

function load(file) {
  console.log(`loading settings from ${file}`)
  nconf.file({file: file})
}

module.exports = {
    load: load
}

'use strict'

const Config = require('electron-config')
const config = new Config()

console.log(`settings loaded from ${config.path}`)

function getValue(key) {
    return config.get(key)
}

function setValue(key, value) {
  config.set(key, value)
}

module.exports = {
    getValue: getValue,
    setValue: setValue
}

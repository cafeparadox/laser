'use strict'

const Config = require('electron-config')
const EventEmitter = require('events')

const Configuration = function (options) {
  this.config = options.config

  console.log(`settings loaded from ${this.config.path}`)
}

Configuration.prototype = new EventEmitter
Configuration.prototype.getValue = function(key) {
  return this.config.get(key)
}

Configuration.prototype.setValue = function(key, value) {
  this.config.set(key, value)
  this.emit(`config-${key}`, value)
}

// only instantiate the configuration once

const configuration = new Configuration({config: new Config()})

module.exports = configuration

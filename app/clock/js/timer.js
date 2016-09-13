const EventEmitter = require('events')

const notStarted = Symbol()
const started = Symbol()
const completed = Symbol()
// const paused = Symbol()

const stateDescriptions = {
  [notStarted]: 'notStarted',
  [started]: 'started',
  [completed]: 'completed'
}

function getTimeRemaining(elapsed, duration) {
  const remaining = duration - elapsed
  const seconds = Math.floor((remaining / 1000) % 60)
  const minutes = Math.floor((remaining / (1000 * 60)) % 60)
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24)
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))

  return {
    remaining, days, hours, minutes, seconds
  }
}

function onInterval(timer) {
  // incrementing the elapsed time by the timer interval smooths out time
  // fluctuations with interval dispatches
  timer.elapsed += timer.interval

  const timeRemaining = getTimeRemaining(timer.elapsed, timer.duration)

  if (timeRemaining.remaining <= 0) {
    clearInterval(timer.intervalReference)
    timer.emit('complete', timeRemaining)
  } else {
    timer.emit('tick', timeRemaining)
  }
}

const Timer = function (options) {
  this.duration = options.duration
  this.interval = options.interval || 1000
  this.elapsed = 0
  this.state = notStarted
  this.intervalReference = null
}

Timer.prototype = new EventEmitter

Timer.prototype.status = function() {
  return stateDescriptions[this.state]
}

Timer.prototype.start = function() {
  if (this.state !== started) {
    this.state = started
    this.elapsed = 0
    this.intervalReference = setInterval(onInterval, this.interval, this)

    this.emit('start', getTimeRemaining(this.elapsed, this.duration))
  }
}

module.exports = Timer

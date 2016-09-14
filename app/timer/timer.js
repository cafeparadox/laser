const EventEmitter = require('events')

const notStarted = Symbol()
const started = Symbol()
const completed = Symbol()
const paused = Symbol()

const stateDescriptions = {
  [notStarted]: 'notStarted',
  [started]: 'started',
  [completed]: 'completed',
  [paused]: 'paused'
}

function getTimeRemaining(elapsed, duration) {
  const remaining = duration - elapsed

  return {
    remaining
  }
}

function onInterval(timer) {
  // incrementing the elapsed time by the timer interval smooths out time
  // fluctuations with interval dispatches
  timer.elapsed += timer.interval

  const timeRemaining = getTimeRemaining(timer.elapsed, timer.duration)

  timer.emit('tick', timeRemaining)

  if (timeRemaining.remaining <= 0) {
    clearInterval(timer.intervalReference)
    timer.state = completed
    timer.elapsed = 0

    timer.emit('complete', timeRemaining)
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
    this.intervalReference = setInterval(onInterval, this.interval, this)
    this.state = started

    this.emit('start', getTimeRemaining(this.elapsed, this.duration))
  }
}

Timer.prototype.pause = function() {
  if (this.state === started) {
    clearInterval(this.intervalReference)
    this.state = paused

    this.emit('pause', getTimeRemaining(this.elapsed, this.duration))
  }
}

module.exports = Timer

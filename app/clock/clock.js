// const {ipcRenderer} = require('electron')
const Timer = require('./timer/timer.js')

window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false) //remove listener, no longer needed
    init()
}, false)

function init() {
  console.log('initializing timer')

  const clock = document.getElementById('clockdiv')
  const daysSpan = clock.querySelector('.days')
  const hoursSpan = clock.querySelector('.hours')
  const minutesSpan = clock.querySelector('.minutes')
  const secondsSpan = clock.querySelector('.seconds')
  const startTimerButton = document.querySelector('.start-button')

  const timer = new Timer({duration: 10 * 1000})
  timer.on('complete', onTimerComplete)
  timer.on('tick', onTimerTick)

  initClockDisplay()

  startTimerButton.addEventListener('click', startTimer)

  function startTimer() {
    if (timer.status() !== 'started') {
      console.log(`starting timer :: duration = ${timer.duration}`);
      startTimerButton.innerHTML = "PAUSE"
      timer.start()
    } else {
      startTimerButton.innerHTML = "RESUME"
      timer.pause()
    }
  }

  function onTimerTick(time) {
    // console.log(`onTimerEvent :: ${event.remaining}`)
    setClockDisplay(time)
  }

  function onTimerComplete(time) {
    initClockDisplay()
  }

  function initClockDisplay() {
    setClockDisplay({days: 0, hours: 0, minutes: 0, seconds: 10})
    startTimerButton.innerHTML = "START"
  }

  function setClockDisplay(time) {
    daysSpan.innerHTML = leftPad(time.days);
    hoursSpan.innerHTML = leftPad(time.hours);
    minutesSpan.innerHTML = leftPad(time.minutes);
    secondsSpan.innerHTML = leftPad(time.seconds);
  }

  function leftPad(text, padText = '0') {
    return `${padText}${text}`.slice(-2);
  }
}

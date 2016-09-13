// const {ipcRenderer} = require('electron')
const Timer = require('./clock/js/timer')

window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    init();
}, false);

function init() {
  console.log('initializing timer');
  const startTimerButton = document.querySelector('.start-button')

  startTimerButton.addEventListener('click', onClick)
}

function onClick() {
  startTimer('clockdiv', {duration: 25 * 60 * 1000})
}

function startTimer(id, duration) {
  console.log(`starting timer :: duration = ${duration}`);
  const clock = document.getElementById(id);
  const daysSpan = clock.querySelector('.days');
  const hoursSpan = clock.querySelector('.hours');
  const minutesSpan = clock.querySelector('.minutes');
  const secondsSpan = clock.querySelector('.seconds');

  var timer = new Timer(duration)
  timer.on('tick', onTimerEvent)
  timer.on('complete', onTimerEvent)
  timer.on('start', onTimerEvent)
  timer.start()

  function onTimerEvent(event) {
    console.log(`onTimerEvent :: ${event.remaining}`)
    daysSpan.innerHTML = leftPad(event.days);
    hoursSpan.innerHTML = leftPad(event.hours);
    minutesSpan.innerHTML = leftPad(event.minutes);
    secondsSpan.innerHTML = leftPad(event.seconds);
  }
}

function leftPad(text, padText = '0') {
  return `${padText}${text}`.slice(-2);
}

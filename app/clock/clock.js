const Timer = require('../timer/timer.js')
const configuration = require('../configuration')
const defaultSettings = require('./default-settings')

console.log('clock.js')

window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false) //remove listener, no longer needed
    init()
}, false)

function init() {
  console.log('initializing clock')

  if (!configuration.getValue('timer')) {
    console.log('default settings loaded')
    configuration.setValue('timer', defaultSettings);
  } else {
    console.log('user settings loaded')
  }

  const timerConfig = configuration.getValue('timer')
  const clock = document.getElementById('clockdiv')
  const minutesSpan = clock.querySelector('.minutes')
  const secondsSpan = clock.querySelector('.seconds')
  const startTimerButton = document.querySelector('.start-button')
  const duration = timerConfig.duration * 60 * 1000

  const timer = new Timer({duration: duration})
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
    setClockDisplay(time.remaining)
  }

  function onTimerComplete(time) {
    console.log('timer complete')
    initClockDisplay()
  }

  function initClockDisplay() {
    setClockDisplay(duration)
    startTimerButton.innerHTML = "START"
  }

  function setClockDisplay(timeRemaining) {
    const seconds = Math.floor((timeRemaining / 1000) % 60)
    const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60)

    minutesSpan.innerHTML = leftPad(minutes);
    secondsSpan.innerHTML = leftPad(seconds);
  }

  function leftPad(text, padText = '0') {
    return `${padText}${text}`.slice(-2);
  }
}

// function load_home(){
//   document.getElementById("content").innerHTML='<object type="text/html" data="home.html" ></object>';
// }

// var xhr= new XMLHttpRequest();
// xhr.open('GET', 'x.html', true);
// xhr.onreadystatechange= function() {
//     if (this.readyState!==4) return;
//     if (this.status!==200) return; // or whatever error handling you want
//     document.getElementById('y').innerHTML= this.responseText;
// };
// xhr.send();

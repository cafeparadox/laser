const Timer = require('../timer/timer.js')
// const configuration = require('../configuration')
const configurationTest = require('../configuration')

const defaultSettings = require('./default-settings')
const electron = require('electron')
const remote = electron.remote
const configuration = remote.getGlobal('configuration')
const audio = require('../audio/audio')

// console.log('clock.js')

window.onload = (event) => {
  console.log('initializing clock')

  configuration.on('config-timer', (config) => {
    // console.log(`clock.js:: timer config change: ${config.duration}`)
    if (timer.status() !== 'started' && timer.status() !== 'paused') {
      initTimer()
      initClockDisplay()
    }
  })

  if (!configuration.getValue('timer')) {
    console.log('default settings loaded')
    configuration.setValue('timer', defaultSettings);
  } else {
    console.log('user settings loaded')
  }

  const clock = document.getElementById('clockdiv')
  const minutesSpan = clock.querySelector('.minutes')
  const secondsSpan = clock.querySelector('.seconds')
  const startTimerButton = document.querySelector('.start-button')

  const timer = new Timer({})
  timer.on('complete', onTimerComplete)
  timer.on('tick', onTimerTick)

  initTimer()
  initClockDisplay()

  startTimerButton.onclick = startTimer

  function initTimer() {
    const timerConfig = configuration.getValue('timer')
    const duration = timerConfig.duration * 60 * 1000
    timer.setDuration(duration);
  }

  function startTimer() {
    if (timer.status() !== 'started') {
      // console.log(`starting timer :: duration = ${timer.duration}`);
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
    playTickSound()
  }

  function onTimerComplete(time) {
    // console.log('timer complete')
    initClockDisplay()
    playAlarmSound()
  }

  function initClockDisplay() {
    setClockDisplay(timer.duration)
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

  function playTickSound() {
    const timerConfig = configuration.getValue('timer')
    audio.playTick(timerConfig.tickSound)
  }

  function playAlarmSound() {
    const timerConfig = configuration.getValue('timer')
    audio.playAlarm(timerConfig.alarmSound)
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

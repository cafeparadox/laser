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

  const stateReady = Symbol()
  const stateActive = Symbol()
  const statePaused = Symbol()
  let currentState = stateReady

  configuration.on('config-timer', (config) => {
    // console.log(`clock.js:: timer config change: ${config.duration}`)
    if (currentState === stateReady) {
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
  const clockLabel = document.getElementById('clockLabel')
  const startButton = document.getElementById('startButton')
  const pauseButton = document.getElementById('pauseButton')
  const stopButton = document.getElementById('stopButton')
  const resumeButton = document.getElementById('resumeButton')

  const timer = new Timer({})
  timer.on('complete', onTimerComplete)
  timer.on('tick', onTimerTick)

  setTimerDisplay()
  setButtonStates()

  startButton.onclick = startTimer
  pauseButton.onclick = pauseTimer
  stopButton.onclick = stopTimer
  resumeButton.onclick = resumeTimer

  function initTimer() {
    const timerConfig = configuration.getValue('timer')
    const duration = timerConfig.duration * 60 * 1000
    timer.setDuration(duration);
  }

  function startTimer() {
    if (currentState === stateReady) {
      currentState = stateActive
      setButtonStates()
      timer.start()
    }
  }

  function pauseTimer() {
    if (currentState === stateActive) {
      currentState = statePaused
      setButtonStates()
      timer.pause()
    }
  }

  function stopTimer() {
    if (currentState === statePaused) {
      currentState = stateReady
      setButtonStates()
      timer.stop()

      setTimerDisplay()
    }
  }

  function resumeTimer() {
      if (currentState === statePaused) {
        currentState = stateActive
        setButtonStates()
        timer.start()
      }
  }

  function setTimerDisplay() {
    initTimer()
    initClockDisplay()
  }

  function onTimerTick(time) {
    // console.log(`onTimerEvent :: ${event.remaining}`)
    setClockDisplay(time.remaining)
    playTickSound()
  }

  function onTimerComplete(time) {
    // console.log('timer complete')
    setTimerDisplay()
    playAlarmSound()
  }

  function initClockDisplay() {
    setClockDisplay(timer.duration)
    startButton.innerHTML = "START"
  }

  function setClockDisplay(timeRemaining) {
    const seconds = Math.floor((timeRemaining / 1000) % 60)
    const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60)

    clockLabel.innerHTML = `${leftPad(minutes)} : ${leftPad(seconds)}`
  }

  function leftPad(text, padText = '0') {
    return `${padText}${text}`.slice(-2);
  }

  function setButtonStates() {
    startButton.classList.add('hidden')
    pauseButton.classList.add('hidden')
    stopButton.classList.add('hidden')
    resumeButton.classList.add('hidden')

    switch (currentState) {
      case stateReady:
        startButton.classList.remove('hidden')
        break
      case stateActive:
        pauseButton.classList.remove('hidden')
        break
      case statePaused:
        stopButton.classList.remove('hidden')
        resumeButton.classList.remove('hidden')
        break
    }
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

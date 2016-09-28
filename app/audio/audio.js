const audioAssets = require('../audio/asset-config.js')

const cache = {}

function getTickSounds() {
  return Object.keys(audioAssets.tickAssets)
}

function getAlarmSounds() {
  return Object.keys(audioAssets.alarmAssets)
}

function playTick(name) {
  playSound(`$tick-${name}`, audioAssets.tickAssets[name])
}

function playAlarm(name) {
  playSound(`$alarm-${name}`, audioAssets.alarmAssets[name])
}

function getAssetURL(fileName) {
  return `${__dirname}/assets/${fileName}`
}

function playSound(cacheKey, fileName) {
  if (fileName !== "") {
    if (!cache[cacheKey]) {
      cache[cacheKey] = new Audio(getAssetURL(fileName))
    }

    const sound = cache[cacheKey]
    sound.currentTime = 0
    sound.play()
  }
}

module.exports = {
  getTickSounds,
  getAlarmSounds,
  playTick,
  playAlarm
}

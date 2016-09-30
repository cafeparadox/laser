const electron = require('electron')
const remote = electron.remote
const ipcRenderer = electron.ipcRenderer
const configuration = require('../configuration')
const audio = require('../audio/audio')

window.onload = (event) => {
  console.log('init settings');
  const closeElement = document.querySelector('.close-button');
  const configuration = remote.getGlobal('configuration')
  const timerConfig = configuration.getValue('timer')

  closeElement.onclick = (event) => {
    ipcRenderer.send('close-settings-window');
  }

  initSettingElements(timerConfig)

  function initSettingElements(config) {
    Object.keys(config).forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        setElementValue(element, config[id])
        setElementLabel(element, config[id])
        element.onchange = onSettingChange
        element.oninput = onSettingInput
      } else {
        console.log(`no element found for config: '${id}'`)
      }
    })

    initSelectElements()
  }

  function initSelectElements() {
    const tickSelectElement = document.getElementById('tickSound')
    const alarmSelectElement = document.getElementById('alarmSound')

    initSelectElement(tickSelectElement, audio.playTick, audio.getTickSounds(), timerConfig.tickSound)
    initSelectElement(alarmSelectElement, audio.playAlarm, audio.getAlarmSounds(), timerConfig.alarmSound)
  }

  function initSelectElement(element, onChange, values, selectedValue) {
    if (element) {
      element.onchange = (event) => {
        onChange(event.currentTarget.value)
      }

      values.forEach(value => {
        element.add(createOption(value, value, value === selectedValue))
      })
    }
  }

  function createOption(label, value, selected) {
      const option = document.createElement("option")

      option.label = label
      option.value = value
      option.selected = selected

      return option
  }

  function onSettingChange(event) {
    const element = event.currentTarget
    const value = getElementValue(element)
    // console.log(`${element.id} changed: ${value}`)

    timerConfig[element.id] = value
    configuration.setValue('timer', timerConfig)
  }

  function onSettingInput(event) {
    const element = event.currentTarget
    const value = getElementValue(element)

    setElementLabel(element, value)
  }

  function getElementValue(element) {
      let value = null

      if (element) {
        if (isCheckbox(element)) {
          value = element.checked
        } else if (isRangeSlider(element)) {
          value = element.valueAsNumber
        } else {
          value = element.value
        }
      }

      return value
  }

  function setElementValue(element, value) {
    if (element) {
      if (isCheckbox(element)) {
        element.checked = value
      } else if (isRangeSlider(element)) {
        element.valueAsNumber = value
      } else {
        element.value = value
      }
    }
  }

  function setElementLabel(element, value) {
    if (element && hasLabel(element)) {
      const label = document.getElementById(`${element.id}Label`)
      if (label) {
        label.innerHTML = value
      }
    }
  }

  /*
    TODO See if there is a way to query the DOM to see if there a label element
      has been assigned to the passed element i.e. <label for="">
  */

  function hasLabel(element) {
    return element && isRangeSlider(element)
  }

  function isCheckbox(element) {
    return isType(element, 'checkbox')
  }

  function isRangeSlider(element) {
    return isType(element, 'range')
  }

  function isType(element, type) {
    return element && element.type.toLowerCase() === type
  }
}

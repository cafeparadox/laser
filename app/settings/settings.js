const electron = require('electron')
const remote = electron.remote
const ipcRenderer = electron.ipcRenderer
const configurationTest = require('../configuration')

window.addEventListener("load", function load(event) {
    console.log(window)
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    init();
}, false);

function init() {
  console.log('init settings');
  const closeElement = document.querySelector('.close-button');
  const configuration = remote.getGlobal('configuration')
  const timerConfig = configuration.getValue('timer')

  configuration.on('config-timer', (config) => {
    console.log(`timer config change: ${config.duration}`)
  })

  closeElement.addEventListener('click', (event) => {
    clearSettingsElements(timerConfig)
    ipcRenderer.send('close-settings-window');
  })

  initSettingElements(timerConfig)

  function initSettingElements(config) {
    Object.keys(config).forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        setElementValue(element, config[id])
        setElementLabel(element, config[id])
        element.addEventListener('input', onSettingChange)
      } else {
        console.log(`no element found for id: '${id}'`)
      }
    })
  }

  function clearSettingsElements(config) {
    Object.keys(config).forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        element.removeEventListener('input', onSettingChange)
      }
    })
  }

  function onSettingChange(event) {
    const element = event.currentTarget
    const value = getElementValue(element)
    // console.log(`${element.id} changed: ${value}`)

    timerConfig[element.id] = value
    configuration.setValue('timer', timerConfig)

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

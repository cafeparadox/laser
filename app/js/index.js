require('./clock/clock.js')
const {ipcRenderer} = require('electron')

console.log('index.js')

window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    init();
}, false);

function init() {
  console.log('initializing index');
  const settingsElement = document.querySelector('.settings-button');

  settingsElement.addEventListener('click', function onClick() {
    ipcRenderer.send('open-settings-window');
  })
}

const {ipcRenderer} = require('electron')

window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    init();
}, false);

function init() {
  console.log('init settings');
  const closeElement = document.querySelector('.close-button');

  closeElement.addEventListener('click', function onClick() {
    ipcRenderer.send('close-settings-window');
  })
}

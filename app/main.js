// const electron = require('electron')
const electron = require('electron')
const ipcMain = electron.ipcMain

global.configuration = require('./configuration')

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  // acceptFirstMouse: true,
  // titleBarStyle: 'hidden'

    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      minWidth: 400,
      minHeight: 300
    })

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`)

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  console.log('app ready')
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

app.on('quit', (evt, exitCode) => {
    console.log(`application quit with exit code: ${exitCode}`)
})

process.on('uncaughtException', (err) => {
    console.error('uncaught exception (restart suggested): ', err)
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
var settingsWindow = null

ipcMain.on('open-settings-window', (event, arg) => {
  console.log('opening settings window')

  if (!settingsWindow) {
    settingsWindow = new BrowserWindow({
      frame: false,
      height: 600,
      resizable: false,
      width: 600,
      parent: mainWindow,
      modal: true,
      show: false
    })

    settingsWindow.webContents.openDevTools()
    settingsWindow.loadURL(`file://${__dirname}/settings/settings.html`)

    settingsWindow.on('ready-to-show', () => {
      settingsWindow.show()
    })
  }
})

ipcMain.on('close-settings-window', (event, args) => {
  console.log('closing settings window')

  if (settingsWindow) {
    // calling close by itself causes the window to 'flicker'
    settingsWindow.hide()
    settingsWindow.close()
    settingsWindow = null
  }
})

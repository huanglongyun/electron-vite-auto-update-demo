import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Updater from './updater/index'
class CreateWindow {
  window
  constructor(config?, routerPath: string = '') {
    this.window = new BrowserWindow({
      width: 900,
      height: 670,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      },
      ...config
    })
    this.window.webContents.openDevTools()
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.window.loadURL(process.env['ELECTRON_RENDERER_URL'] + routerPath)
    } else {
      this.window.loadFile(join(__dirname, '../renderer/index.html'))

      // this.window.loadFile(join(__dirname, '../renderer/src/loading.html'))
      // this.window.loadFile(join(__dirname, '../../resources/loading.html'))
    }
  }
  show() {
    this.window.on('ready-to-show', () => {
      this.window.show()
    })
  }
  hide() {
    this.window.hide()
  }
}
let mainWindow = null
let updaterWindow = null
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // mainWindow.on('ready-to-show', () => {
  //   mainWindow.show()
  // })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createUpdaterWindow(): void {
  // Create the browser window.
  updaterWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  updaterWindow.on('ready-to-show', () => {
    updaterWindow.show()
    new Updater(updaterWindow)
  })

  updaterWindow.webContents.openDevTools()
  // updaterWindow.loadFile(join(__dirname, '../../resources/loading.html'))

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    updaterWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/updater')
  } else {
    updaterWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()
  createUpdaterWindow()
  // const mainWindow = new CreateWindow()
  // const updater = new CreateWindow({ width: 400, height: 400 }, '/#/updater')
  // updater.show()
  // updaterWindow.show()
  // setTimeout(() => {
  //   updaterWindow.webContents.send('hide-loading-show-main')
  // }, 2000)
  ipcMain.handle('render-to-main', () => {
    console.log('nihao ')
    updaterWindow.hide()
    mainWindow.show()
  })
  // setTimeout(() => {
  //   updater.hide()
  //   mainWindow.show()
  // }, 2000)
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

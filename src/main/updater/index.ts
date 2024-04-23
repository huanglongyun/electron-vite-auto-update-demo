import { autoUpdater } from 'electron-updater'
import { is } from '@electron-toolkit/utils'
import { app } from 'electron'
import { join } from 'path'

export default class Updater {
  constructor(updatertt) {
    // 询问服务器是否有更新，需要调用 API
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      Object.defineProperty(app, 'isPackaged', {
        get() {
          return true
        }
      })

      // 检测是否更新：对标一个线上url
      autoUpdater.updateConfigPath = join(__dirname, '../../dev-app-update.yml')
    }

    autoUpdater.on('checking-for-update', () => {
      console.log('111 当开始检查更新的时候触发')
    })

    autoUpdater.on('update-available', () => {
      console.log('222 当有可用更新的时候触发。 更新将自动下载')
    })

    autoUpdater.on('update-not-available', () => {
      console.log('333 当没有可用更新的时候触发')
      updatertt.webContents.send('hide-loading-show-main')
    })

    autoUpdater.on('download-progress', (info) => {
      console.log('444 更新进度', info)
    })
    autoUpdater.on('update-downloaded', () => {
      console.log('555 在更新下载完成的时候触发')
      // 重启应用并在下载后安装更新
      autoUpdater.quitAndInstall()
    })

    // 询问服务器是否有更新，需要调用 API
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      // 开发环境：测试
      autoUpdater.checkForUpdates()
    } else {
      // 生产环境：用户已安装在电脑上
      autoUpdater.checkForUpdatesAndNotify()
    }
  }
}

import { BrowserWindow } from 'electron'

export const Logger = (mainWindow: BrowserWindow) => ({
  log(...payload) {
    console.log(...payload)
    mainWindow.webContents.send('log', {
      type: 'log',
      payload,
    })
  },
  error(...payload) {
    console.error(...payload)
    mainWindow.webContents.send('log', {
      type: 'error',
      payload,
    })
  },
})

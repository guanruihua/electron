import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ObjectType } from '0type'
import { AppSize } from './type'

// Custom APIs for renderer
const api = {
  onShortcut: (type: string, callback) => {
    ipcRenderer.on('shortcut-info', (event, data) => {
      if (data?.type === type) {
        callback(data)
      }
      console.log(event)
    })
  },
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  openPath: (path: string) => {
    // shell.openExternal(path)
    shell.openPath(path)
  },
  setSize: async (conf: AppSize) =>
    await ipcRenderer.invoke('set-app-size', conf),
  getStartMenu: async () => await ipcRenderer.invoke('get-startMenu'),
  invoke: async (type: string, conf: ObjectType = {}) =>
    (await ipcRenderer.invoke(type, conf)) || {},
  test: async (data: any) => {
    console.log('🚀 ~ data:', data)
    // return await ipcRenderer.invoke('read-start-menu-dir')
    return await ipcRenderer.invoke('test', data)
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

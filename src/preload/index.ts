import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ObjectType } from '0type'
import { FS_Action, FS_Payload } from './type'

// Custom APIs for renderer
const api = {
  on: (eventName: string, callback: (data: any) => void) =>
    ipcRenderer.on(eventName, (_event, data) => callback(data)),
  off: (eventName: string, callback: (data: any) => void) =>
    ipcRenderer.off(eventName, (_event, data) => callback(data)),
  onNewTab: (callback) => {
    ipcRenderer.on('newTabEvent', (_event, data) => callback(data))
  },
  openMaskWindow: () => {
    ipcRenderer.invoke('open-mask-window')
  },
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
  fs: async (action: FS_Action, payload: FS_Payload) =>
    await ipcRenderer.invoke('fs', {
      action,
      payload,
    }),
  invoke: async (type: string, payload: ObjectType = {}) =>
    (await ipcRenderer.invoke(type, payload)) || {},
  test: async (data: any) => {
    console.log('🚀 ~ data:', data)
    // return await ipcRenderer.invoke('read-start-menu-dir')
    return await ipcRenderer.invoke('test', data)
  },
}

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

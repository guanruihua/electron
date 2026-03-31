import { ObjectType } from '0type'
import { ElectronAPI } from '@electron-toolkit/preload'
import { AppSize } from './type'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      on(eventName: string, callback: (data: ObjectType) => void): void
      off(eventName: string, callback: (data: ObjectType) => void): void
      onNewTab(callback: (data: ObjectType) => void): void
      openMaskWindow(): void
      resizeMaskWindow(zoom: number): void
      store: (conf: ObjectType) => Promise<any>
      // 窗口控制
      minimize: () => void
      maximize: () => void
      close: () => void
      //
      openPath: (path: string) => void
      /**
       * @description 获取开始开始菜单的快捷方式
       * @returns {string[]} path[]
       */
      getStartMenu: () => Promise<ObjectType[]>
      /**
       * @description 监听快捷键
       * @param {string} type
       * @param callback
       * @returns {void}
       */
      onShortcut: (type: string, callback: (info: any) => void) => void
      setSize: (conf: AppSize) => void
      /**
       * @param type
       * 'toggleDevTools' 折叠控制台
       *  'cmd' 执行命令
       *  'dev' 执行运行服务的命令
       *  'fs' 文件系统相关
       *  'cmdResult'  执行命令, 有log 回调
       * 'updateApps' 更新 apps 列表
       * 'getLocalIP' 获取本机IP
       */
      invoke: (
        type: 'toggleDevTools' | 'cmd' | 'dev' | 'fs' | 'cmdResult' | 'updateApps' | 'getLocalIP' | 'getFileTree' | 'getRunningApp' 
        | 'stopAppByName' | 'getUserDataPath' | 'copy' | 'getClipboard',
        conf?: ObjectType | string | number,
      ) => Promise<any>
      test: (conf: any) => Promise<any>
    }
  }
}

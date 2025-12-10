import { ObjectType } from '0type'
import { ElectronAPI } from '@electron-toolkit/preload'
import { AppSize } from './type'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
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
      invoke: (type: string, conf?: ObjectType) => Promise<ObjectType>
      test: (conf: any) => Promise<any>
    }
  }
}

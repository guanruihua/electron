import { ObjectType } from '0type'
import { ElectronAPI } from '@electron-toolkit/preload'

type InvokeType =
  | 'window-minimize'
  | 'window-unmaximize'
  | 'window-maximize'
  | 'window-close'
  | 'toggleDevTools'
  | 'cmd'
  | 'dev'
  | 'fs'
  | 'cmdResult'
  | 'updateApps'
  | 'getSysInfo'
  | 'getFileTree'
  | 'getRunningApp'
  | 'stopAppByName'
  | 'getUserDataPath'
  | 'copy'
  | 'getClipboard'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      on(eventName: string, callback: (data: ObjectType) => void): void
      off(eventName: string, callback: (data: ObjectType) => void): void
      onNewTab(callback: (data: ObjectType) => void): void
      openMaskWindow(): void
      openPath: (path: string) => void
      /**
       * @description 监听快捷键
       * @param {string} type
       * @param callback
       * @returns {void}
       */
      onShortcut: (type: string, callback: (info: any) => void) => void
      /**
       * - window-minimize  最小化窗口
       * - window-unmaximize 取消最大化窗口
       * - window-maximize 最大化窗口
       * - window-close 关闭窗口
       * - toggleDevTools 折叠控制台
       * - cmd 执行一次性命令
       * - dev 执行服务命令
       * - fs  文件系统
       * - cmdResult 执行命令, 有log 回调
       * - updateApps 更新 app 列表
       * - getSysInfo 获取系统信息
       * - getFileTree 获取文件树
       * - getRunningApp 获取运行 app
       * - stopAppByName  停止 app 运行
       * - getUserDataPath 获取用户数据路径
       * - copy 复制
       * - getClipboard 获取剪贴画
       * @param {InvokeType} type
       * @param {any} [conf]
       * @returns {Promise<any>}
       */
      invoke: (type: InvokeType, conf?: any) => Promise<any>
    }
  }
}

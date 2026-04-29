import { ObjectType } from '0type'

export type InvokeType =
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

export type FS_Action =
  | 'createPathIfNotExist'
  | 'ensureExists'
  | 'stat'
  | 'deleteFile'
  | 'getJSONFileData'
  | 'readCurrentDir'
  | 'readFile'
  | 'saveJSON2File'
  | 'saveFile'

export type FileSystemSetting = Partial<{
  includeDir: string
  excludeDir: string
  includeFile: string
  excludeFile: string
  [key: string]: any
}>

export type FS_Payload = {
  path: string
  isFile?: boolean
  data?: string | ObjectType<any> | any[]
  format?: boolean
  setting?: FileSystemSetting
  [key: string]: any
}

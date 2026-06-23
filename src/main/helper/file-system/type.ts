import { ObjectType } from '0type'

export type FileSystemSetting = Partial<{
  includeDir: string
  excludeDir: string
  includeFile: string
  excludeFile: string
  [key: string]: any
}>

export type FS_Payload = {
  url?: string
  /**
   * 覆盖
   */
  cover?: boolean
  path: string
  isFile?: boolean
  data?: string | ObjectType<any> | any[]
  format?: boolean
  setting?: FileSystemSetting
  [key: string]: any
}

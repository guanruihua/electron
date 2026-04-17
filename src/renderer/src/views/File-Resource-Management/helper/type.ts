import { ObjectType } from '0type'
import { SetLoadings } from '@/util'
import { ModalStaticFunctions } from 'antd/lib/modal/confirm'
import { Stats } from 'fs'

export type FileNode = Partial<{
  // 文件夹/文件名
  name: string
  // 完整路径
  path: string
  parentPath: string
  // 是否为文件夹
  type: 'dir' | 'file'
  fileType: string
  children?: FileNode[]
}>

export type PageState = Partial<{
  drives: string[]
  selectDrive: string
  pathMap: ObjectType<any>
  fsStat: ObjectType<Stats>
  select: Partial<
    FileNode & {
      fileType: string
      stats: Stats
      [key: string]: any
    }
  >
  setting: Partial<{
    show: number
    showInfo: number
    includeDir: string
    excludeDir: string
    includeFile: string
    excludeFile: string
    [key: string]: any
  }>
  [key: string]: any
}>

export type HandlePage = {
  // modal: ModalStaticFunctions
  modal: any
  setLoadings: SetLoadings
  setPageState(pageState: PageState): void
  init(): Promise<void>
  readCurrentDir(path: string): Promise<void>
  selectFileNode(item: FileNode): Promise<void>
}

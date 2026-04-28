import { ObjectType } from '0type'
import { SetLoadings } from '@/util'
import { ModalStaticFunctions } from 'antd/lib/modal/confirm'
import { Stats } from 'fs'
import { FileNode } from '@/type'

export * from '@/type'

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
  confirm: ModalStaticFunctions['confirm']
  setLoadings: SetLoadings
  setPageState(pageState: PageState): void
  init(): Promise<void>
  readCurrentDir(path: string): Promise<void>
  selectFileNode(item: FileNode): Promise<void>
}

import { create } from 'zustand'
import { isString } from 'asura-eye'
import { getData, FileNode, getFileType, PageState } from './helper'
import { getHeaderPaths, getPathMap } from './helper/store'

type Actions<T> = {
  set(newState: Partial<T>): void
  get(): T
  init(): Promise<void>
}

export type FRMStore = PageState & Actions<PageState>

export const useFRMStore = create<FRMStore>(
  (set, get) => ({
    initSuccess: false,
    drives: [],
    open: [],
    selectDrive: '',
    fsStat: {},
    pathMap: {},
    select: {},
    setting: {
      show: 0,
      showInfo: 1,
      excludeDir:
        '.pnpm-store,$RECYCLE.BIN,Config.Msi,System Volume Information,Program Files,Recovery,WindowsApps,D:\\software_data,node_modules',
      includeDir: '',
      includeFile: '',
      excludeFile: '',
    },
    headerPaths: [],
    async init() {
      const drives = (await getData('driver')) || ['c:']
      const selectDrive =
        drives.length > 1 ? drives.find((_) => _ !== 'C:') : drives[0]
      const pathMap = await getPathMap(selectDrive, this)
      const headerPaths = getHeaderPaths(selectDrive)

      pathMap![''] = drives.map((path) => ({
        name: path,
        parentPath: '',
        path,
        sortBy: 9000,
        type: 'dir',
        fileType: 'dir',
      }))

      set({
        initSuccess: true,
        drives,
        headerPaths,
        pathMap,
        selectDrive,
        select: {
          name: selectDrive,
          parentPath: '',
          path: selectDrive + '\\',
          sortBy: 9000,
          type: 'dir',
          fileType: 'dir',
        },
      })
    },
    async selectFileNode(item: FileNode) {
      // console.log('selectFileNode: ', item)
      const { open = [] } = this
      const { path, type } = item

      if (!isString(path)) return
      const fileType = getFileType(item)

      const stats = await window.api.invoke('fs', {
        action: 'stat',
        payload: { path },
      })
      const newPageState: PageState = {
        select: { ...item, stats, fileType },
        open,
        headerPaths: getHeaderPaths(path),
      }

      if (type === 'dir') {
        const newOpen = open.includes(path)
          ? open.filter((_) => _ !== path)
          : [path, ...open]

        newPageState.open = newOpen

        if (newOpen.includes(path) && !this.pathMap?.[path]?.length) {
          newPageState.pathMap = await getPathMap?.(path, this)
        }
      }

      set(newPageState)
    },
    set,
    get,
  }),
)

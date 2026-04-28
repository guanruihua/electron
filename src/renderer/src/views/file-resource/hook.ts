import React from 'react'
import { useLoadings, useSetState } from '@/util'
import { getData, FileNode, getFileType } from './helper'
import { HandlePage, PageState } from './helper/type'
import { isString } from 'asura-eye'
import { Modal } from 'antd'
import { ObjectType } from '0type'

export function usePageState(): {
  loadings: ObjectType<boolean>
  pageState: PageState
  contextHolder: React.ReactElement
  handlePage: HandlePage
} {
  const [modal, contextHolder] = Modal.useModal()
  const [loadings, setLoadings] = useLoadings()
  const [pageState, setPageState] = useSetState<PageState>({
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
  })

  const readCurrentDir = async (path: string) => {
    const values = await getData('dir', path, pageState.setting)
    if (pageState.pathMap) {
      pageState.pathMap[path] = values
    } else {
      pageState.pathMap = {
        [path]: values,
      }
    }
  }

  const setHeaderPaths = (path: string, type: any) => {
    if (!isString(path)) return
    let list = path.split('\\') || []
    // if (type === 'file') list = list.slice(0, list.length - 1)

    pageState.headerPaths = list
      .map((value, i) => {
        return {
          value,
          dataKey: list.slice(0, i).join('\\'),
        }
      })
      .concat({
        value: '',
        dataKey: path,
      })
  }

  const init = async () => {
    const drives = (await getData('driver')) || ['c:']
    const selectDrive =
      drives.length > 1 ? drives.find((_) => _ !== 'C:') : drives[0]
    await readCurrentDir(selectDrive)
    setHeaderPaths(selectDrive, 'dir')
    // console.log({
    //   drives,
    //   selectDrive,
    // })
    pageState.pathMap![''] = drives.map((path) => ({
      name: path,
      parentPath: '',
      path,
      sortBy: 9000,
      type: 'dir',
      fileType: 'dir',
    }))

    setPageState({
      drives,
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
    return
  }

  React.useEffect(() => {
    init()
  }, [])

  const selectFileNode = async (item: FileNode) => {
    // console.log('selectFileNode: ', item)
    const { open = [] } = pageState
    const { path, type } = item

    if (!isString(path)) return
    const fileType = getFileType(item)

    const stats = await window.api.invoke('fs', {
      action: 'stat',
      payload: { path },
    })
    const newPageState = {
      select: { ...item, stats, fileType },
      open,
    }

    if (type === 'dir') {
      const newOpen = open.includes(path)
        ? open.filter((_) => _ !== path)
        : [path, ...open]

      newPageState.open = newOpen

      if (newOpen.includes(path) && !pageState?.pathMap?.[path]?.length) {
        await readCurrentDir?.(path)
      }
    }
    setHeaderPaths(path, type)

    setPageState?.(newPageState)
  }

  return {
    loadings,
    pageState,
    contextHolder,
    handlePage: {
      confirm: modal.confirm,
      setLoadings,
      setPageState,
      init,
      readCurrentDir,
      selectFileNode,
    },
  }
}

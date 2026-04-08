import React from 'react'
import { useLoadings, useSetState } from '@/util'
import { getData, FileNode, getFileType } from './helper'
import { PageState } from './helper/type'
import { isString } from 'asura-eye'

export const usePageState = () => {
  const [loadings, setLoadings] = useLoadings()
  const [pageState, setPageState] = useSetState<PageState>({
    drives: [],
    open: [],
    selectDrive: '',
    fsStat: {},
    pathMap: {},
    select: {},
    setting: {},
    headerPaths: [],
  })

  const readCurrentDir = async (path: string) => {
    const values = await getData('dir', path)
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
    if (type === 'file') list = list.slice(0, list.length - 1)

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
    const drives = await getData('driver')
    const selectDrive = drives.find((_) => _ !== 'C:')
    await readCurrentDir(selectDrive)
    setHeaderPaths(selectDrive, 'dir')

    pageState.pathMap![''] = drives.map((path) => ({
      name: path,
      parentPath: '',
      path,
      sortBy: 9000,
      type: 'dir',
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
      },
    })
    return
  }

  React.useEffect(() => {
    init()
  }, [])

  console.log(pageState)
  const selectFileNode = async (item: FileNode) => {
    console.log('selectFileNode: ', item)
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
        // console.log(path, ':', pageState?.pathMap?.[path]?.length || 0)
      }
    }
    setHeaderPaths(path, type)
    setPageState?.(newPageState)
  }

  return {
    loadings,
    pageState,
    handlePage: {
      setLoadings,
      setPageState,
      init,
      readCurrentDir,
      selectFileNode,
    },
  }
}

import React from 'react'
import { useLoadings, useSetState } from '@/util'
import { getData } from './helper'
import { PageState } from './helper/type'

export const usePageState = () => {
  const [loadings, setLoadings] = useLoadings()
  const [pageState, setPageState] = useSetState<PageState>({
    drives: [],
    depth: 1,
    open: [],
    selectDrive: '',
    fsStat: {},
    pathMap: {},
    select: {},
    setting: {},
  })

  const readCurrentDir = async (path: string) => {
    const values =
      (
        await window.api.invoke('fs', {
          action: 'readCurrentDir',
          payload: {
            path,
          },
        })
      )
        .filter((_: any) => Boolean(_?.name))
        .map((item: any) => {
          item.sortBy = item.name.charCodeAt(0)
          if (item.type === 'dir') item.sortBy += 10000
          if (item.type === 'file') item.sortBy -= 10000
          return item
        })
        .sort((a: any, b: any) => b.sortBy - a.sortBy) || []

    if (pageState.pathMap) {
      pageState.pathMap[path] = values
    } else {
      pageState.pathMap = {
        [path]: values,
      }
    }
  }

  const init = async () => {
    const drives = await getData('driver')
    const selectDrive = drives.find((_) => _ !== 'C:\\')
    await readCurrentDir(selectDrive)
    setPageState({
      drives,
      selectDrive,
    })
    return
  }

  React.useEffect(() => {
    init()
  }, [])

  return {
    loadings,
    pageState,
    handlePage: {
      setLoadings,
      setPageState,
      init,
      readCurrentDir,
      async selectDriver(driver: string) {
        pageState.selectDrive = driver
        await readCurrentDir(driver)
        setPageState(pageState)
      },
    },
  }
}

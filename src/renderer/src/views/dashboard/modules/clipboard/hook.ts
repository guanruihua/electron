import React from 'react'
import { ObjectType } from '0type'
import { ModuleProps } from '@/type'
import { useLoadings, useSetState } from '@/util'
import { isArray, isObject } from 'asura-eye'
import {
  getClipboardList,
  getRenderList,
  getUID,
  saveClipboard2File,
} from './helper'
import type { PageState } from './type'

export const usePageState = (props: ModuleProps) => {
  const { h } = props
  const { handle, state } = h

  const [pageState, setPageState] = useSetState<PageState>({
    counts: {
      all: 0,
      text: 0,
      image: 0,
      file: 0,
      star: 0,
    },
    selectType: 'all',
    list: [],
    renderList: [],
  })

  const [loadings, setLoadings] = useLoadings({
    edit: false,
    editFile: false,
    reload: false,
  })

  const handleSelf = {
    setLoadings,
    setPageState,
    async star(target: ObjectType) {
      const list =
        pageState?.list?.map((item) => {
          if (getUID(item) === getUID(target)) {
            item.star = item?.star ? 0 : 1
          }
          return item
        }) || []
      this.updateList(list)
    },
    async updateList(payload: any) {
      // console.log('list: ', oldList)
      let newList: ObjectType[] = []
      if (isObject(payload)) {
        const oldList: ObjectType[] = await getClipboardList(state)
        const uid = getUID(payload)
        for (let i = 0; i < oldList.length; i++)
          if (getUID(oldList[i]) === uid) return
        // console.log('payload: ', payload, oldList)
        newList = [payload, ...oldList]
      }

      if (isArray(payload)) {
        newList = payload
      }

      const DataCount: string[] = []
      const newList2: ObjectType[] = []

      const newCounts: PageState['counts'] = {
        all: newList?.length || 0,
        text: 0,
        image: 0,
        file: 0,
        star: 0,
      }
      let i = 0
      newList.forEach((item) => {
        const flag = getUID(item)
        if (item.type === 'image') newCounts.image++
        if (item.type === 'text') newCounts.text++
        if (item.star) newCounts.star++
        if (DataCount.includes(flag)) return
        item.num = ++i
        newList2.push(item)
        DataCount.push(flag)
      })

      setPageState({
        list: newList2,
        renderList: getRenderList(newList2, pageState.selectType),
        counts: newCounts,
      })

      saveClipboard2File(state, newList2)
    },

    async del(item: ObjectType) {
      if (!isObject(item)) return
      const list =
        pageState?.list?.filter((_) => getUID(_) !== getUID(item)) || []
      this.updateList(list)
    },
    async copy(item: ObjectType) {
      if (!isObject(item)) return
      const { type, data } = item
      const run = async () => {
        if (type === 'image') {
          return window.api.invoke('copy', {
            base64: data,
          })
        }
        if (type === 'text') {
          return window.api.invoke('copy', {
            data,
          })
        }
      }
      const res = await run()
      res ? handle.success('Copy Success...') : handle.error('Copy Error...')
      return false
    },

    async reload() {
      const list = await getClipboardList(state)
      isArray(list) && this.updateList(list)
      return
    },
  }

  React.useEffect(() => {
    if (state.initSysSettingSuccess && state.initUserSettingSuccess) {
      handleSelf.reload()

      const run = async () => {
        const res = await window.api.invoke('getClipboard')
        if (!res?.data) return
        res.time = Date.now()
        handleSelf.updateList(res)
      }
      const timer = setInterval(run, 1000)
      return () => {
        timer && clearInterval(timer)
      }
    }
    return
  }, [state.initSysSettingSuccess, state.initUserSettingSuccess])

  return {
    state,
    loadings,
    pageState,
    handleSelf,
  }
}

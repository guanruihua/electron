import React from 'react'
import { ObjectType } from '0type'
import { useLoadings, useMsg, useSetState } from '@/util'
import { isArray, isObject } from 'asura-eye'
import { getRenderList, getUID } from './helper'
import type { DataSchema, PageState } from './type'
import { SysState } from '@/type'

const tableName = 'clipboard'
export const usePageState = (sys: SysState) => {
  const { context, success, error } = useMsg()

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
    init: true,
    edit: false,
    editFile: false,
    reload: false,
  })

  const handleSelf = {
    setLoadings,
    setPageState,
    async star(target: ObjectType) {
      const res = await window.api.db({
        action: 'update',
        tableName,
        payload: {
          ...target,
          star: target?.star ? 0 : 1,
        },
      })
      !res.error && this.reload()
    },
    async add(payload: Partial<DataSchema>) {
      const res = await window.api.db({
        action: 'add',
        tableName,
        payload,
      })
      !res.error && this.reload()
    },
    async updateList(newList: ObjectType[]) {
      // console.log('list: ', oldList)
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
    },

    async del(item: ObjectType) {
      if (!isObject(item)) return
      const res = await window.api.db({
        action: 'delete',
        tableName,
        payload: item,
      })
      !res.error && this.reload()
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
      res ? success('Copy Success...') : error('Copy Error...')
      return false
    },

    async reload() {
      setLoadings(true, 'init')
      const res = await window.api.db({
        action: 'find',
        tableName,
      })
      if (res?.error) return setLoadings(false, 'init')
      isArray(res.data) && this.updateList(res.data)
      setLoadings(false, 'init')
      return
    },
  }

  React.useEffect(() => {
    if (!sys.initSuccess) return
    handleSelf.reload()

    const run = async () => {
      const res = await window.api.invoke('getClipboard')
      if (!res?.data || res?.data.trim().length < 1) return
      console.log('copy: ', res)
      handleSelf.add(res)
    }
    const timer = setInterval(run, 1000)
    return () => {
      timer && clearInterval(timer)
    }
  }, [sys.initSuccess])

  return {
    loadings,
    pageState,
    handleSelf,
    context,
  }
}

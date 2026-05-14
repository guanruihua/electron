import React from 'react'
import { ObjectType } from '0type'
import { useLoadings, useMsg, useSetState } from '@/util'
import { isArray, isObject } from 'asura-eye'
import { getRenderList } from './helper'
import type { DataSchema, PageState } from './type'
import { SysState } from '@/type'
import { tableName, DBName } from './conf'

export const usePageState = (sys: SysState) => {
  const { context, success, error } = useMsg()

  const [pageState, setPageState] = useSetState({
    selectType: 'all',
    enable: true,
  })

  const [clipboardState, setClipboardState] = useSetState<PageState>({
    counts: {
      all: 0,
      text: 0,
      image: 0,
      file: 0,
      star: 0,
    },
    list: [],
    renderList: [],
  })

  const [loadings, setLoadings] = useLoadings({
    init: true,
    edit: false,
    editFile: false,
    reload: false,
  })

  const copy = async (item: ObjectType) => {
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
  }

  const handleSelf = {
    setLoadings,
    setPageState,
    copy,
    async star(target: ObjectType) {
      const res = await window.api.db({
        action: 'update',
        tableName,
        DBName,
        payload: {
          ...target,
          star: target?.star ? 0 : 1,
        },
      })
      !res.error && this.reload()
    },
    async add(payload: Partial<DataSchema>) {
      if (isArray(clipboardState.list)) {
        for (const item of clipboardState.list) {
          if (payload.type !== item.type) continue
          if (payload.type === 'text' && item.data === payload.data) return
          if (
            payload.type === 'image' &&
            item.data.slice(0, 100) === payload.data.slice(0, 100)
          )
            return
        }
      }
      const res = await window.api.db({
        action: 'add',
        tableName,
        DBName,
        payload,
      })
      !res.error && this.reload()
    },
    async updateList(newList: ObjectType[]) {
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
        if (item.type === 'image') newCounts.image++
        if (item.type === 'text') newCounts.text++
        if (item.star) newCounts.star++
        item.num = ++i
        newList2.push(item)
      })

      setClipboardState({
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
        DBName,
        payload: item,
      })
      if (res.error) return
      this.reload()
    },

    async reload() {
      const res = await window.api.db({
        action: 'find',
        tableName,
        DBName,
      })
      if (res?.error) return
      isArray(res.data) && this.updateList(res.data)
      return
    },
  }

  const watchCopy = async () => {
    const res = await window.api.invoke('getClipboard')
    if (!res?.data || res?.data.trim().length < 1) return
    handleSelf.add(res)
  }

  const timer = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (pageState.enable) {
      if (!timer.current) timer.current = setInterval(watchCopy, 1000)
    } else {
      timer.current && clearInterval(timer.current)
      timer.current = null
    }
    return () => {
      timer.current && clearInterval(timer.current)
      timer.current = null
    }
  }, [sys.initSuccess, pageState.enable])

  React.useEffect(() => {
    if (!sys.initSuccess) return
    setLoadings(handleSelf.reload(), 'init')
  }, [sys.initSuccess])

  return {
    loadings,
    pageState,
    clipboardState,
    handleSelf,
    context,
  }
}

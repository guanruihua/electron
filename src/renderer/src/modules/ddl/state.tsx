import React from 'react'
import { updateCountdown } from './helper/helper'
import { getJSON, useLoading } from '@/util'
import { isString } from 'asura-eye'
import { SysState } from '@/type'
import './info.less'
import { WebViewState } from '@/views/hot/store'

export const useMyState = (sys: SysState, wv: WebViewState) => {
  const { userInfo } = sys
  const { weatherInfo } = userInfo
  const [loading, setLoading] = useLoading()
  const [ddl, setDDL] = React.useState<string[]>(['今天不用上班！'])
  const timer = React.useRef<NodeJS.Timeout | null>(null)

  const clear = () => {
    timer.current && clearInterval(timer.current)
  }

  const reload = async () => {
    if (!sys.initSuccess || !sys.path) return

    const path = sys.path + '\\ddl.json'
    const res = await window.api.fs('readFile', { path })
    if (!isString(res)) {
      return
    }
    const Conf = getJSON(res)
    Conf.weatherInfo = weatherInfo
    Conf.webViewData = wv.Data

    clear()

    const update = async () => await updateCountdown(Conf)

    setDDL(await update())

    const cb = async () => {
      setDDL(await update())
    }
    timer.current = setInterval(cb, 1000)
  }

  React.useEffect(() => {
    reload()
    return clear
  }, [sys.initSuccess, sys.path])

  return {
    loading,
    setLoading,
    ddl,
    reload,
  }
}

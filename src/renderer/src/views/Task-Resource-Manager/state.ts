import { useEffect } from 'react'
import { format } from './helper'
import { useLoadings, useSetState } from '@/util'
import { TRMState, UseTRMState } from '@/type'
import dayjs from 'dayjs'
import { useRef } from 'react'

export const useTRMState = (): UseTRMState => {
  const [loadings, setLoadings] = useLoadings()
  const [state, setState] = useSetState<TRMState>({
    lastUpdate: '',
    list: [],
  })
  const init = async () => {
    setLoadings(true, 'init')
    const cmd = `powershell -Command "Get-Process | ForEach-Object { try { $p = $_.MainModule.FileVersionInfo.ProductName; $name = if ([string]::IsNullOrWhiteSpace($p)) { $_.ProcessName } else { $p } } catch { $name = $_.ProcessName }; [PSCustomObject]@{ ProcessName = $_.ProcessName; Id = $_.Id; 'PM(KB)' = [math]::Round($_.PrivateMemorySize64 / 1KB); SoftwareName = $name;  } } | Format-Table -AutoSize"`
    const res = await window.api.invoke('cmd', cmd)
    setState({
      lastUpdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      list: format(res),
    })
    setLoadings(false, 'init')
  }
  const timer = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    init()
    const cb = async () => {
      await init()
      timer.current && clearTimeout(timer.current)
      timer.current = setTimeout(cb, 3000)
    }
    timer.current = setTimeout(cb, 3000)
    return () => {
      timer.current && clearTimeout(timer.current)
    }
  }, [])

  return {
    state,
    loadings,
    handlePage: {
      setLoadings,
      setState,
      init,
    },
  }
}

import { SysState } from '@/type'
import { isString } from 'asura-eye'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export const getOrigin_NodeThread = async (): Promise<
  SysState['NodeThreads']
> => {
  const cmd = `wmic process where name="node.exe" get commandline,CreationDate,ProcessId,WorkingSetSize`
  const res = await window.api.invoke('cmd', cmd)
  if (!isString(res)) return { NodeTreads: [], pids: [] }
  // console.log(res)
  const rows = res
    .trim()
    .split(/\n/)
    .map((_) =>
      _.trim()
        .split(/\s+/)
        .map((_) => _.trim()),
    )
    .slice(1)

  const list: SysState['NodeTreads'] = []

  rows?.forEach((row: string[]) => {
    const record: SysState['NodeTreads'][0] = {
      title: 'Node',
      dirPath: '',
      memory: 0,
      pid: [],
      createTime: '',
    }

    row?.forEach((item: string) => {
      if (!isString(item)) return
      if (/\\/.test(item)) {
        if (item.includes('node.exe') || item.includes('npm-cli.js')) return
        record.dirPath = item
          .split('\\node_modules')
          .at(0)!
          .replaceAll('\"', '')
        return
      }
      if (/^(\d{14})\.\d+\+(\d+)$/.test(item)) {
        // WMIC 时间字符串
        const wmicTime = item
        // const wmicTime = '20260507102345.123456+480'

        // 提取时间部分 + 时区分钟
        const match = wmicTime.match(/^(\d{14})\.\d+\+(\d+)$/)
        if (match) {
          const timeStr = match[1] // 20260507102345
          const offsetMin = match[2] // 480

          // 转换成本地时间
          const dt = dayjs(timeStr, 'YYYYMMDDHHmmss').utcOffset(offsetMin) // 直接应用时区偏移
          record.createTime = dt.format('YYYY-MM-DD HH:mm:ss')
          // console.log('本地时间:', )
        }
      }
      if (/^\d+$/.test(item)) {
        if (record.pid?.length) return (record.memory = Number(item))
        record.pid!.push(item)
        return
      }
      return
    })
    list.push(record)
    return
  })

  // console.log({ list })
  return list
}

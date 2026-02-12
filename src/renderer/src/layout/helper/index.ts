import { isString } from 'asura-eye'

export const toNodeTreads = (text: string) =>
  text
    .trim()
    .split('\n')
    .map((line) =>
      line.match(/^(\S+)\s+(\d+)\s+(\S+)\s+(\d+)\s+([\d,]+)(?:\s*(\w+))?/),
    )
    .filter(Boolean)
    .map((match: any) => ({
      name: match[1],
      pid: match[2],
      session: match[3],
      sessionNum: match[4],
      memory: match[5].replace(/,/g, ''),
      unit: match[6] || 'K',
    }))

export const getPathByPID = async (pid: string | number) => {
  const res = await window.api.invoke(
    'cmd',
    `wmic process where processid=${pid} get executablepath,commandline /value`,
  )
  if (!isString(res)) return

  let value: string | undefined = res
    .trim()
    .replaceAll('\r', '')
    .split(/\\node_modules|node\.exe/)
    .at(0)

  if (!value || !value.includes('CommandLine=node')) return

  return value
    .replace('CommandLine=node', '')
    .trim()
    .replace(/^\"/, '')
    .replaceAll('\\', '>')
 
}

export const setStatus_NodeTread = async (NodeTreads: any[]) => {
  const pids = NodeTreads.map((_) => _.pid) || []
  const pathMap = {}
  for (let i = 0; i < pids.length; i++) {
    const pid = pids[i]
    const path = await getPathByPID(pid)
    if (path) pathMap[path] = pid
  }
  const doms: NodeListOf<HTMLDivElement> | null =
    document.querySelectorAll(`.opt-item[data-pid]`)
  if (!doms) return
  doms.forEach((dom) => {
    const path: string | undefined = dom.dataset.path
    const pid = path && pathMap[path]
    if (pid) {
      dom.dataset.pid = pid
      dom.dataset.start = '1'
    } else {
      dom.dataset.pid = ''
      dom.dataset.start = ''
    }
  })
}

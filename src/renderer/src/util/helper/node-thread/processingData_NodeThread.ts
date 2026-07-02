import { ObjectType } from '0type'
import { NodeTread, ProjectConf } from '@/type'
import { isArray, isObject, isString } from 'asura-eye'

export const processingData_NodeThread = (
  OriginNodeTreads: NodeTread[],
  projects: ProjectConf,
  runningUIDMapPID: ObjectType<string[]>,
) => {
  // console.log({
  //   OriginNodeTreads,
  //   modules,
  //   runningUIDMapPID,
  // })
  const nameMap: ObjectType<string> = {}
  let NodeTreads: NodeTread[] = []

  for (let i = 0; i < OriginNodeTreads.length; i++) {
    const item = OriginNodeTreads[i]
    const { dirPath, pid = [], memory = 0 } = item
    // 有dirPath和下一个线程一般为同一组
    const next = OriginNodeTreads.at(i + 1)
    if (!dirPath && next && next?.dirPath) {
      const newPid = [...new Set(pid.concat(next.pid || []).filter(Boolean))]
      NodeTreads.push({
        ...next,
        dirPath: next.dirPath,
        pid: newPid,
        memory: memory + (next.memory || 0),
      })
      ++i
    } else {
      NodeTreads.push(item)
    }
  }
  // 把pid 和 path 映射处理上
  const UIDs = Object.keys(runningUIDMapPID)
  if (UIDs.length) {
    UIDs.forEach((uid) => {
      const pids = runningUIDMapPID[uid] || []
      const newNodeTread: NodeTread = {
        title: 'Node',
        dirPath: uid,
        memory: 0,
        pid: pids,
        createTime: '',
      }
      if (pids.length) {
        pids.forEach((pid) => {
          const i = NodeTreads.findIndex((_) => _.pid?.includes(pid))
          const NodeTread = NodeTreads.find((_) => _.pid?.includes(pid))
          if (!NodeTread) return
          newNodeTread.memory! += NodeTread?.memory || 0
          newNodeTread.createTime = NodeTread?.createTime || ''
          NodeTreads[i].pid = []
        })
        NodeTreads.push(newNodeTread)
      }
    })
  }
  NodeTreads = NodeTreads.filter((_) => _.pid?.length)

  const setPid = (item: ProjectConf) => {
    if (!isObject(item) || !isString(item?.path)) return
    const { path } = item

    item.pid = []
    item.memory = 0
    item.running = false

    NodeTreads.forEach((row) => {
      const { dirPath, pid = [], memory = 0 } = row
      if (dirPath === '') return
      if (dirPath === path) {
        if (isArray(pid)) {
          if (isArray(item.pid)) {
            item.pid = [...new Set([...pid, ...item.pid])].filter(Boolean)
          } else {
            item.pid = [...new Set(pid)].filter(Boolean)
          }
        }
        memory && (item.memory! += memory)
        nameMap[dirPath] = item.label || item.path || 'Node'
        row.title = item.label
        return
      }
      return
    })

    if (!item.running && item?.pid?.length) {
      item.running = true
    }
  }

  // console.log(NodeTreads, Modules)

  return {
    NodeTreads,
    projects: projects.map((item) => {
      setPid(item)
      if (isArray(item.children)) {
        item.children = item.children.map((child) => {
          setPid(child)
          return child
        })
      }
      return item
    }),
  }
}

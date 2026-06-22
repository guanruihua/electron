import React from 'react'
import { ProjectConf } from '@/type'
import { UseSysState } from '@/store/sys'
import { useState } from 'react'
import { UseTaskState } from '@/store/task'
import { isArray } from 'asura-eye'
import { getNodePids } from '@/util'

type UseProjectOpt = {
  item: ProjectConf
  task: UseTaskState
  sys: UseSysState
}
export const useProjectOpt = (params: UseProjectOpt) => {
  const { item, task, sys } = params
  const { loadings } = task

  const { label, path } = item
  const projName = label
  const [FSStatus, setFSState] = useState({
    'package.json': false,
    node_modules: false,
  })

  const initStatus = async () => {
    if (!item.path) return
    const res = await window.api.fs('readCurrentDir', { path: item.path })
    if (!isArray(res)) return
    const status = {
      'package.json': false,
      node_modules: false,
    }
    const keys = Object.keys(status)
    for (let i = 0; i < res.length; i++) {
      const item = res[i]
      if (keys.includes(item.name)) {
        status[item.name] = true
      }
    }
    setFSState(status)
  }

  const init = async () => {
    initStatus()
  }
  React.useEffect(() => {
    init()
  }, [item.path])

  const install = async () =>
    task.run({
      id: `projectOptDependencies/install`,
      cmd: `cd ${item.path} && cnpm i`,
    })

  const uninstall = async () =>
    task.run({
      id: `projectOptDependencies/uninstall`,
      cmd: `cd ${item.path} && rimraf node_modules`,
    })

  const execTask = async (
    type:
      | 'Web'
      | 'VSCode'
      | 'Cmd'
      | 'FRM'
      | 'install'
      | 'uninstall'
      | 'reinstall',
    value?: any,
  ): Promise<any> => {
    if (type === 'install') return install()
    if (type === 'uninstall') return uninstall()
    if (type === 'reinstall') {
      await uninstall()
      await install()
      return
    }
    const CMD = {
      Web: `explorer "${value}"`,
      FRM: `explorer "${item.path}"`,
      VSCode: `code ${item.path}`,
      Cmd: `start cmd /k "cd /d \"${item.path}\""`,
    }
    const cmd = CMD[type]
    if (!cmd) return

    task.run({
      id: `cmd/${type}`,
      desc: `Project Name: ${projName}`,
      cmd,
    })
  }

  const updateStatus = async () => {
    await task.run({
      id: 'nodeThread/query',
      exec: sys.findNodeTreads,
    })

    await task.run({
      id: 'projectOpt/updateStatus',
      exec: init,
    })
  }

  const run = async () => {
    if (!item.npm) return
    return task.run({
      id: 'projectOpt/run',
      async exec() {
        const pids_start = await getNodePids()

        const res = await window.api.invoke(
          'dev',
          `cd ${item.path} && npm.cmd run ${item.npm}`,
        )
        const pids_end = await getNodePids()
        const pids = [
          ...pids_end.filter((_) => !pids_start.includes(_)),
          ...pids_start.filter((_) => !pids_end.includes(_)),
        ].filter(Boolean)
        const { runningUIDMapPID } = sys.get()
        runningUIDMapPID[path!] = pids
        sys.set({ runningUIDMapPID })
        updateStatus()
        return res
      },
    })
  }

  const runGroup = async (e: any) => {
    e?.stopPropagation()
    e?.preventDefault()
    await run()

    if (item['url-review'])
      await task.run({
        id: 'projectOptRunGroup/explorer',
        cmd: `explorer "${item['url-review']}"`,
      })

    await task.run({
      id: 'projectOptRunGroup/vscode',
      cmd: `code ${item.path}`,
    })
    await updateStatus()
  }

  const stop = async () =>
    task.run({
      id: 'projectOpt__stop',
      async exec() {
        if (!isArray(item.pid)) return
        const cmd = `taskkill ${item.pid.map((p) => `/PID ${p}`).join(' ')} /F`
        await window.api.invoke('cmd', cmd)
        const { runningUIDMapPID } = sys.get()
        delete runningUIDMapPID[path!]
        sys.set({ runningUIDMapPID })
        updateStatus()
      },
    })

  return {
    projName,
    FSStatus,
    run,
    runGroup,
    stop,
    execTask,
  }
}

import React from 'react'
import { ProjectConf } from '@/type'
import { useSysStore } from '@/store/sys'
import { useState } from 'react'
import { useTaskStore } from '@/store/task'
import { isArray, isString } from 'asura-eye'
import { getNodePids } from '@/util'

export const useProjectOpt = ({ item }: { item: ProjectConf }) => {
  const sys = useSysStore()
  const task = useTaskStore()
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

  const install = () =>
    task.run({
      id: `projectOptDependencies__install`,
      name: `The Project installation dependencies`,
      desc: `Project Name: ${projName}`,
      async exec() {
        return await window.api.invoke('cmd', `cd ${item.path} && cnpm i`)
      },
    })

  const uninstall = () =>
    task.run({
      id: `projectOptDependencies__uninstall`,
      name: `The Project installation dependencies`,
      desc: `Project Name: ${projName}`,
      async exec() {
        return await window.api.invoke(
          'cmd',
          `cd ${item.path} && rimraf node_modules`,
        )
      },
    })

  const CMD = {
    Web: async (value: any) =>
      isString(value) && window.api.invoke('cmd', `explorer "${value}"`),
    FRM: async () => window.api.invoke('cmd', `explorer "${item.path}"`),
    VSCode: async () => window.api.invoke('cmd', `code ${item.path}`),
    Cmd: async () =>
      window.api.invoke('cmd', `start cmd /k "cd /d \"${item.path}\""`),
  }

  const execTask = (
    type:
      | 'Web'
      | 'VSCode'
      | 'Cmd'
      | 'FRM'
      | 'install'
      | 'uninstall'
      | 'reinstall',
    value?: any,
    name?: string,
  ): any => {
    if (type === 'install') return install()
    if (type === 'uninstall') return uninstall()
    if (type === 'reinstall') {
      uninstall()
      install()
      return
    }
    const exec = CMD[type]
    if (!exec) return

    task.run({
      id: `cmd__${type}`,
      name: name || `Open the Project in ${type}`,
      desc: `Project Name: ${projName}`,
      async exec() {
        return exec(value)
      },
    })
  }

  const updateStatus = () => {
    task.run({
      id: 'nodeThread__query',
      name: 'Query Node Thread',
      exec: sys.findNodeTreads,
    })

    task.run({
      id: 'projectOpt__updateStatus',
      name: `Update the Project Status`,
      desc: `Project Name: ${projName}`,
      async exec() {
        return await init()
      },
    })
  }

  const run = async () => {
    if (!item.npm) return
    task.run({
      id: 'projectOpt__run',
      name: `Run the Project`,
      type: 'running',
      uid: path,
      desc: `Project Name: ${projName}`,
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
    run()

    if (item['url-review'])
      task.run({
        id: 'projectOptRunGroup__explorer',
        name: `Open the Project in Google`,
        desc: `Project Name: ${projName}`,
        async exec() {
          return await window.api.invoke(
            'cmd',
            `explorer "${item['url-review']}"`,
          )
        },
      })

    task.run({
      id: 'projectOptRunGroup__vscode',
      name: `Open the Project in VSCode`,
      desc: `Project Name: ${projName}`,
      async exec() {
        await window.api.invoke('cmd', `code ${item.path}`)
        updateStatus()
      },
    })
  }

  const stop = async () => {
    task.run({
      id: 'projectOpt__stop',
      name: `Stop the Project`,
      type: 'stop',
      uid: path,
      desc: `Project Name: ${projName}`,
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
  }

  return {
    projName,
    loadings,
    FSStatus,
    item,
    run,
    runGroup,
    stop,
    execTask,
  }
}

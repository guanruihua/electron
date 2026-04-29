import React from 'react'
import { ProjectConf } from '@/type'
import { useSysStore } from '@/store/sys'
import { useState } from 'react'
import { useTaskStore } from '@/store/task'
import { isArray, isString } from 'asura-eye'

export const useProjectOpt = () => {
  const sys = useSysStore()
  const task = useTaskStore()
  const { loadings } = task

  const [startStatus, setStartStatus] = useState(0)
  const item: ProjectConf = sys?.selectProject || {}
  const { label } = item
  const projName = label
  const [FSStatus, setFSState] = useState({
    'package.json': false,
    node_modules: false,
  })

  const timer = React.useRef<NodeJS.Timeout | null>(null)

  const clear = () => {
    timer.current && clearInterval(timer.current)
  }

  const load = () => {
    if (!item?.path) return timer.current && clearInterval(timer.current)
    const dataPath = item.path.replaceAll('\\', '>')
    const dom: HTMLDivElement | null = document.querySelector(
      `.opt-item[data-path='${dataPath}']`,
    )
    if(dom?.dataset?.start === '1'){
      startStatus ===0 && setStartStatus(1)
    }else{
      startStatus ===1 && setStartStatus(0)
    }
  }

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
    clear()
    load()
    initStatus()
    timer.current = setInterval(load, 1000)
  }
  React.useEffect(() => {
    init()
    return clear
  }, [item.path])

  const install = () =>
    task.add({
      id: `projectOptDependencies__install`,
      name: `The ${projName} Project installation dependencies`,
      async exec() {
        return await window.api.invoke('cmd', `cd ${item.path} && cnpm i`)
      },
    })

  const uninstall = () =>
    task.add({
      id: `projectOptDependencies__uninstall`,
      name: `The ${projName} Project installation dependencies`,
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

    task.add({
      id: `nodeThread__${type}`,
      name: name || `Open the ${projName} Project in ${type}`,
      async exec() {
        exec(value)
      },
    })
  }

  const updateStatus = () => {
    task.add({
      id: 'nodeThread__query',
      name: 'Query Node Thread',
      exec: sys.findNodeTreads,
    })

    task.add({
      id: 'projectOpt__updateStatus',
      name: `Update the ${projName} Project Status`,
      async exec() {
        return await init()
      },
    })
  }

  const run = async () => {
    task.add({
      id: 'projectOpt__run',
      name: `Run the ${projName} Project`,
      async exec() {
        await window.api.invoke(
          'dev',
          `cd ${item.path} && npm.cmd run ${item.npm}`,
        )
        setStartStatus(1)
      },
    })

    updateStatus()
  }

  const runGroup = async () => {
    run()

    if (item['url-review'])
      task.add({
        id: 'projectOptRunGroup__explorer',
        name: `Open the ${projName} Project in Google`,
        async exec() {
          return await window.api.invoke(
            'cmd',
            `explorer "${item['url-review']}"`,
          )
        },
      })

    task.add({
      id: 'projectOptRunGroup__vscode',
      name: `Open the ${projName} Project in VSCode`,
      async exec() {
        return await window.api.invoke('cmd', `code ${item.path}`)
      },
    })
  }

  const stop = async () => {
    task.add({
      id: 'projectOpt__stop',
      name: `Stop the ${projName} Project`,
      async exec() {
        if (!item.path) return
        const selector = `.opt-item[data-path="${item.path.replaceAll('\\', '>')}"]`
        const dom: HTMLDivElement | null = document.querySelector(selector)
        if (!dom) return
        const pids = [...new Set(dom.dataset.pid?.split(' '))]
        for (let i = 0; i < pids.length; i++) {
          const pid = pids[i]
          await window.api.invoke('cmd', `taskkill /PID ${pid} /F`)
        }
        setStartStatus(0)
      },
    })
    updateStatus()
  }

  return {
    projName,
    loadings,
    startStatus,
    FSStatus,
    item,
    run,
    runGroup,
    stop,
    execTask,
  }
}

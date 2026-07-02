import { Icon } from '@/components'
import { ProjectConf } from '@/type'
import { copy } from '@/util'
import { getNodePids } from '@/util'
import { isArray } from 'asura-eye'

export const getConf = ({
  p,
  task,
  wv,
  loadings,
  item,
  showGit,
  setShowGit,
}) => {
  const {
    running, 
    path,
    Jenkins,
    webs = [],
    FSStatus = {
      'package.json': false,
      node_modules: false,
    },
  }: ProjectConf = item

  const { url_frontend, url_backend, frontend_status, backend_status } =
    Jenkins || {}

  const scanInfo = async () => {
    await wv.analysisURL(url_frontend, url_frontend, false)
    await wv.analysisURL(url_backend, url_backend, false)
    await p.updateProjectData(item)
  }

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
    const install = async () =>
      task.run({
        uid: `projectOptDependencies/install`,
        cmd: `cd ${item.path} && cnpm i`,
      })

    const uninstall = async () =>
      task.run({
        uid: `projectOptDependencies/uninstall`,
        cmd: `cd ${item.path} && rimraf node_modules`,
      })

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

    await task.run({
      uid: `cmd/${type}`,
      cmd,
    })
  }

  const updateStatus = async () => {
    await task.run({
      uid: 'nodeThread/query',
      exec: p.findNodeTreads,
    })
  }

  const run = async () => {
    if (!item.npm) return
    return task.run({
      uid: `projectOpt/run-${path}`,
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
        const { runningUIDMapPID } = p.get()
        runningUIDMapPID[path!] = pids
        p.set({ runningUIDMapPID })
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
        uid: 'projectOptRunGroup/explorer',
        cmd: `explorer "${item['url-review']}"`,
      })

    await task.run({
      uid: 'projectOptRunGroup/vscode',
      cmd: `code ${item.path}`,
    })
    await updateStatus()
  }

  const stop = async () =>
    task.run({
      uid: `projectOpt/stop-${path}`,
      async exec() {
        if (!isArray(item.pid)) return
        const cmd = `taskkill ${item.pid.map((p) => `/PID ${p}`).join(' ')} /F`
        await window.api.invoke('cmd', cmd)
        const { runningUIDMapPID } = p.get()
        delete runningUIDMapPID[path!]
        p.set({ runningUIDMapPID })
        updateStatus()
      },
    })

  const Header = [
    {
      className: 'run',
      icon: <Icon type="run-all" />,
      onClick: runGroup,
      title: 'All',
      hidden: FSStatus.node_modules === false || !item.npm || running,
      loading: loadings.projectOptRunGroup || loadings.projectOptDependencies,
    },
    {
      className: 'run',
      icon: <Icon type="run" />,
      title: 'Run',
      onClick: run,
      loading:
        loadings[`projectOpt/run-${path}`] || loadings.projectOptDependencies,
      disabled: FSStatus.node_modules === false,
      hidden: !item.npm || running,
    },
    {
      className: 'stop',
      icon: <Icon type="stop" />,
      onClick: stop,
      loading:
        loadings[`projectOpt/stop-${path}`] || loadings.projectOptDependencies,
      title: 'Stop',
      hidden: !item.npm || !running,
    },
    {
      icon: <Icon type="google" />,
      title: 'Review',
      onClick: () => execTask('Web', item['url-review']),
      hidden: !item['url-review'],
    },
    {
      loading: loadings['projectOpt/VSCode'],
      icon: <Icon type="vscode" />,
      onClick: () => execTask('VSCode'),
      title: 'VS Code',
    },
    {
      icon: (
        <Icon
          type="world-search"
          style={
            {
              fontSize: 20,
              '--color':
                frontend_status === 'success' && backend_status === 'success'
                  ? 'var(--success)'
                  : 'var(--error)',
            } as React.CSSProperties
          }
        />
      ),
      hidden: !Jenkins,
      onClick: scanInfo,
    },
  ].filter((_) => !_.hidden)

  const list = [
    {
      icon: <Icon type="copy" />,
      label: 'Copy Path',
      onClick() {
        copy(path)
      },
    },
    {
      loading: loadings.projectOpt__Cmd,
      icon: <Icon type="cmd" />,
      onClick: () => execTask('Cmd'),
      label: 'Cmd',
    },
    {
      loading: loadings.projectOpt__FRM,
      icon: <Icon type="dir" />,
      onClick: () => execTask('FRM'),
      label: 'FRM',
    },
    {
      className: 'project-git',
      'data-show-git': showGit,
      icon: <Icon type="git" />,
      onClick: () => setShowGit((v) => !v),
      hidden: item.git === false,
      label: 'Git',
    },
  ].filter((_) => !_.hidden)

  const FS_List = FSStatus['package.json']
    ? [
        {
          disabled: true,
          icon: <Icon type="install" />,
        },
        {
          'data-type': 'install',
          disabled: FSStatus.node_modules === true,
          loading: loadings.projectOptDependencies,
          className: 'project-item-content-module-child-item',
          onClick: () => execTask('install'),
          label: 'Install',
        },
        {
          'data-type': 'reinstall',
          disabled: FSStatus.node_modules === false,
          loading: loadings.projectOptDependencies,
          className: 'project-item-content-module-child-item',
          onClick: () => execTask('reinstall'),
          label: 'Reinstall',
        },
        {
          'data-type': 'uninstall',
          disabled: FSStatus.node_modules === false,
          loading: loadings.projectOptDependencies,
          className: 'project-item-content-module-child-item',
          onClick: () => execTask('uninstall'),
          label: 'Uninstall',
        },
      ]
    : []

  const Webs_List = [
    {
      disabled: true,
      icon: <Icon type="google" />,
    },
    {
      label: 'Review',
      onClick: () => execTask('Web', item['url-review']),
      hidden: !item['url-review'],
    },
    ...webs.map((key) => {
      const value = item[key]
      const tmp = key.replace('url-', '')
      const label = tmp.slice(0, 1).toUpperCase() + tmp.slice(1)
      return {
        className: 'text-10',
        'data-key': key,
        loading: loadings[`projectOpt__Web-${value}`],
        onClick: () => value && execTask('Web', value),
        label,
      }
    }),
  ].filter(Boolean)

  return {
    Header,
    list,
    FS_List,
    Webs_List,
  }
}

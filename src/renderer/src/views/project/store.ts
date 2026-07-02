import { isArray, isString } from 'asura-eye'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useSysStore } from '@/store/sys'
import { NodeTread, ProjectConf } from '@/type'
import { getNodeThread, likeValue } from '@/util'
import { getFSStatus, getJenkins } from './helper'
import { useWebViewStore } from '../hot/store'
import { ObjectType } from '0type'

export type ProjState = Partial<{
  activeUID: string
  loadings: Partial<{
    [key: string]: boolean
  }>
  Init: Partial<{
    [key: string]: any
  }>
  Data: Partial<{
    [key: string]: any
  }>
  projects: ProjectConf[]
  NodeTreads: NodeTread[]
  runningUIDMapPID: ObjectType<string[]>
  [key: string]: any
}>

export type ProjActions<T> = {
  set(newState: Partial<T>): void
  get(): T
  init(): Promise<void>
  getProjectData(item: ProjectConf): Promise<ProjectConf>
  updateProjectData(item: ProjectConf): Promise<void>

  findNodeTreads(): Promise<void>
  stopNodeTreads(): Promise<void>
  stopNodeTread(item: ObjectType): Promise<void>
}

export type UseWebViewState = ProjState & ProjActions<ProjState>

export const useProjStore = create(
  persist<UseWebViewState>(
    (set, get) => ({
      activeUID: '',
      Init: {},
      Data: {},
      loadings: {},
      NodeTreads: [],
      runningUIDMapPID: {},
      projects: [],
      async getProjectData(item: ProjectConf) {
        const { Data = {} } = useWebViewStore.getState()
        const { path } = item
        if (!isString(path)) return item
        item.FSStatus = await getFSStatus(path)

        // jenkins
        item.Jenkins = getJenkins(item, Data)

        // webs
        const webs = Object.keys(item).filter(
          (key) => key.startsWith('url-') && key !== 'url-review',
        )
        if (isArray(webs) && webs.length) {
          item.webs = webs
        }
        return item
      },
      async updateProjectData(item: ProjectConf) {
        const { projects = [] } = get()
        const newItem = await this.getProjectData(item)

        set({
          projects: projects.map((_) => {
            if (_.path === item.path) {
              return newItem
            }
            return _
          }),
        })
      },
      async init() {
        const { runningUIDMapPID = {} } = get()
        const { modules, userInfo } = useSysStore.getState()
        const newState: ProjState = {
          initSuccess: true,
          projects: [],
        }

        if (isArray(modules)) {
          newState.projects =
            modules?.filter((_) =>
              isString(userInfo.setting?.filterModule)
                ? likeValue(userInfo.setting.filterModule, _.label)
                : 
                true,
            ) || []
          set(newState)
          // newState.projects = newState.projects
          const list = newState.projects

          // fs-status
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            newState.projects[i] = await this.getProjectData(item)
          }
          set(newState)
        }

        // console.log('init', initSuccess, userInfo, modules)

        const res = await getNodeThread(newState.projects!, runningUIDMapPID)

        // console.log(res)

        set({ ...newState, ...res })
      },
      async findNodeTreads() {
        const { projects = [] } = get()
        const res = await getNodeThread(projects, get().runningUIDMapPID || {})

        // console.log(res)

        set(res)
      },
      async stopNodeTreads() {
        await window.api.invoke('cmd', 'taskkill /F /IM node.exe')
        await this.findNodeTreads()
      },
      async stopNodeTread(item: ObjectType) {
        if (!item.path) return
        const selector = `.opt-item[data-path="${item.path.replaceAll('\\', '>')}"]`
        const dom: HTMLDivElement | null = document.querySelector(selector)
        if (!dom) return
        const pids = [...new Set(dom.dataset.pid?.split(' '))]
        if (pids.length) {
          await window.api.invoke(
            'cmd',
            `taskkill ${pids.map((p) => `/PID ${p}`).join(' ')} /F`,
          )
          await this.findNodeTreads()
        }
      },
      set,
      get,
    }),
    {
      name: 'project-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

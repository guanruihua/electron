import { ObjectType } from '0type'
import { ProjectConf, SysState } from '@/type'
import { getNodeThread, saveSettingToFile } from '@/util'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getSysInitState } from './sys-helper/init'

type Actions<T> = {
  set(newState: Partial<T>): void
  get(): T
  init(force: boolean): Promise<void>
  saveToFile(type: 'setting' | 'modules' | 'apps'): Promise<void>
  findNodeTreads(): Promise<void>
  stopNodeTreads(): Promise<void>
  stopNodeTread(item: ObjectType): Promise<void>
  handleSelectProject(item: ObjectType): Promise<void>
}

export const useSysStore = create(
  persist<SysState & Actions<SysState>>(
    (set, get) => ({
      initSuccess: false,
      path: '',
      ignoreApps: '',
      selectedQuickStart: 0,
      quickStarts: [] as string[][],
      selectProject: {} as ProjectConf,

      NodeTreads: [],
      modules: [],
      apps: [],
      runningUIDMapPID: {},
      async handleSelectProject(selectProject: ObjectType) {
        set({ selectProject })
        await this.saveToFile('setting')
      },
      async findNodeTreads() {
        const modules = get().modules || []
        const res = await getNodeThread(modules, get().runningUIDMapPID)

        // console.log(res)
        set({
          NodeTreads: res.NodeTreads || [],
          modules: res.Modules || [],
        })
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
        await window.api.invoke(
          'cmd',
          `taskkill ${pids.map((p) => `/PID ${p}`).join(' ')} /F`,
        )
        await this.findNodeTreads()
      },
      async init(force: boolean = false) {
        if (force) set({ initSuccess: true })
        set(await getSysInitState())
        await this.findNodeTreads()
      },
      async saveToFile(type: 'setting' | 'modules' | 'apps') {
        const {
          path,
          ignoreApps,
          quickStarts = [],
          selectedQuickStart = 0,
          selectProject,
        } = get()
        if (!path) return
        if (type === 'setting') {
          saveSettingToFile(path, {
            path,
            ignoreApps,
            quickStarts,
            selectedQuickStart,
            selectProject,
          })
          return
        }
        return
      },
      set,
      get,
    }),
    {
      name: 'sys-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

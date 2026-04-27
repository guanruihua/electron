import { ObjectType } from '0type'
import { ProjectConf, SysState } from '@/type'
import { saveSettingToFile, setStatus_NodeTread, toNodeTreads } from '@/util'
import { isString } from 'asura-eye'
import { create } from 'zustand'
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

export const useSysStore = create<SysState & Actions<SysState>>((set, get) => ({
  initSuccess: false,
  path: '',
  ignoreApps: '',
  selectedQuickStart: 0,
  quickStarts: [] as string[][],
  selectProject: {} as ProjectConf,

  NodeTreads: [],
  modules: [],
  apps: [],
  async handleSelectProject(selectProject: ObjectType) {
    set({ selectProject })
    await this.saveToFile('setting')
  },
  async findNodeTreads() {
    const res = await window.api.invoke('cmd', 'tasklist | findstr node')
    if (isString(res)) {
      const NodeTreads = toNodeTreads(res) || []
      setStatus_NodeTread(NodeTreads)
      set({ NodeTreads })
    }
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
    for (let i = 0; i < pids.length; i++) {
      const pid = pids[i]
      await window.api.invoke('cmd', `taskkill /PID ${pid} /F`)
    }
    await this.findNodeTreads()
  },
  async init(force: boolean = false) {
    if (force) set({ initSuccess: true })
    set(await getSysInitState())
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
}))

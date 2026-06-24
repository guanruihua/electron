import { Task, TaskState } from '@/type'
import { isNumber, isString } from 'asura-eye'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Actions<T> = {
  set(newState: Partial<T>): void
  get(): T
  run(task: Task): Promise<void>
  setLoading(task: Task, loading: boolean): void
}
export type UseTaskState = TaskState & Actions<TaskState>

export const useTaskStore = create(
  persist<UseTaskState>(
    (set, get) => ({
      initSuccess: false,
      running: false,
      loadings: {},
      loadingCount: {},
      async setLoading(task: Task, loading: boolean) {
        const { uid } = task
        if (!isString(uid)) return
        const state = get()
        const loadings = state.loadings
        const loadingCount = state.loadingCount
        loadings[uid] = loading

        if (uid.includes('/')) {
          const group = uid.split('/').at(0)
          if (isString(group)) {
            if (!isNumber(loadingCount[group])) loadingCount[group] = 0

            if (loading) {
              loadingCount[group]++
              loadings[group] = loading
            } else {
              loadingCount[group]--
              if (loadingCount[group] < 1) {
                loadings[group] = false
              }
            }
          }
        }

        set({
          loadings,
          loadingCount,
        })
      },
      async run(task: Task) {
        this.setLoading(task, true)
        try {
          const { exec, cmd } = task
          if (exec) return await exec()
          if (isString(cmd)) return await window.api.invoke('cmd', cmd)
        } catch (error) {
          console.error(task, error)
        } finally {
          this.setLoading(task, false)
        }
      },
      set,
      get,
    }),
    {
      name: 'task-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

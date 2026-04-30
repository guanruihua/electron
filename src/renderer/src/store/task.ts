import { Task, TaskState } from '@/type'
import { isNumber, isObject } from 'asura-eye'
import { create } from 'zustand'

type Actions<T> = {
  set(newState: Partial<T>): void
  get(): T
  add(task: Task): Promise<void>
  run(runIndex?: number): Promise<void>
  setLoading(task: Task, loading: boolean): void
}

export const useTaskStore = create<TaskState & Actions<TaskState>>(
  (set, get) => ({
    initSuccess: false,
    loadings: {},
    loadingsGroup: {},
    tasks: [],
    taskStatus: [],
    taskIndex: 0,
    async run(runIndex?: number) {
      if (!runIndex && runIndex !== 0) runIndex = this.taskIndex ?? 0
      const state = get()
      const task = state.tasks[runIndex]
      if (!isObject<Task>(task)) return
      const { exec, ...rest } = task
      const taskStatus = state.taskStatus[runIndex] || { ...rest }
      if (!exec || !taskStatus?.id || taskStatus?.endTime) return

      const newTaskStatus = get().taskStatus
      taskStatus.startTime = Date.now()
      taskStatus.status = 'running'
      newTaskStatus[runIndex] = taskStatus
      set({
        taskStatus: newTaskStatus,
      })

      try {
        await exec()
      } catch (error) {
        console.error(error)
        taskStatus.status = 'error'
        taskStatus.errorMsg = JSON.stringify(error)
      }
      this.setLoading(task, false)

      taskStatus.endTime = Date.now()
      if (taskStatus.endTime - taskStatus.startTime > 30_000) {
        taskStatus.status = 'warning'
      } else {
        taskStatus.status = 'success'
      }

      newTaskStatus[runIndex] = taskStatus

      set({
        taskIndex: runIndex + 1,
        taskStatus: newTaskStatus,
      })

      await this.run(runIndex + 1)
    },
    async setLoading(task: Task, loading: boolean) {
      const { id } = task
      const state = get()
      const newLoadings = state.loadings
      const newLoadingsGroup = state.loadingsGroup

      let group = task.group
      if (!group && id?.includes('__')) {
        group = id.split('__').at(0)
      }
      if (group)
        if (loading) {
          newLoadings[group] = true
          if (isNumber(newLoadingsGroup[group])) {
            ++newLoadingsGroup[group]
          } else {
            newLoadingsGroup[group] = 1
          }
        } else {
          if (isNumber(newLoadingsGroup[group])) {
            --newLoadingsGroup[group]
          } else {
            newLoadingsGroup[group] = 0
          }
          if (newLoadingsGroup[group] < 1) {
            newLoadingsGroup[group] = 0
            newLoadings[group] = false
          }
        }

      set({
        loadings: newLoadings,
        loadingsGroup: newLoadingsGroup,
      })
    },
    async add(task: Task) {
      const state = get()
      const newTasks = state.tasks
      newTasks.push(task)
      set({
        tasks: newTasks,
      })
      this.setLoading(task, true)
      this.run()
    },
    set,
    get,
  }),
)

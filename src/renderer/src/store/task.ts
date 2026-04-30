import { Task, TaskState } from '@/type'
import { isNumber, isObject } from 'asura-eye'
import { create } from 'zustand'

type Actions<T> = {
  set(newState: Partial<T>): void
  get(): T
  check(): void
  add(task: Task): Promise<void>
  run(runIndex?: number): Promise<void>
  setLoading(task: Task, loading: boolean): void
}

export const useTaskStore = create<TaskState & Actions<TaskState>>(
  (set, get) => ({
    initSuccess: false,
    running: false,
    loadings: {},
    loadingsGroup: {},
    tasks: [],
    taskIndex: 0,
    check(){
      const findIndex= get().tasks.findIndex(_=> !_.endTime)
      console.log(
        findIndex,
        get().tasks[findIndex]
      )
      // if(findIndex>)
    },
    async run(runIndex?: number) {
      if (!runIndex && runIndex !== 0) runIndex = this.taskIndex ?? 0
      const state = get()
      const task = state.tasks[runIndex]
      if (!isObject<Task>(task)) return this.check()
      if (!task?.exec || !task?.id || task?.endTime) return this.check()

      const newTasks = get().tasks
      task.startTime = Date.now()
      task.status = 'running'
      newTasks[runIndex] = task
      set({
        running: true,
        tasks: newTasks,
      })

      try {
        await task.exec()
      } catch (error) {
        console.error(error)
        task.status = 'error'
        task.errorMsg = JSON.stringify(error)
      }
      this.setLoading(task, false)

      task.endTime = Date.now()
      if (task.endTime - task.startTime > 30_000) {
        task.status = 'warning'
      } else {
        task.status = 'success'
      }

      newTasks[runIndex] = task

      set({
        running: true,
        taskIndex: runIndex + 1,
        tasks: newTasks,
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

import React from 'react'
import { useLoading, useSetState } from '@/util'
import { PageState } from './type'
import { getHty, getHtyMsg, gitPull, gitPush } from './helper'
import { ProjectConf } from '@/type'
import { useTaskStore } from '@/store/task'

export const usePageState = (selectProject: ProjectConf) => {
  const { label = '', path } = selectProject || {}
  const task = useTaskStore()
  const [pageState, setPageState] = useSetState<PageState>({
    commitMsg: 'feat: Improve the documentation',
    hty: [],
    hty_options: [],
    tree: [],
    repoStatus: {},
    simpleTree: [],
  })

  const [fold, setFold] = React.useState<string[]>([])

  const [loading, setLoading] = useLoading(false)

  const query = async () => {
    if (selectProject.git === false) return
    setLoading(true)
    task.add({
      id: 'gitReview__init',
      name: 'Git Review / Pull State',
      desc: `Project Name: ${label}`,
      async exec() {
        const htyMsg = await getHtyMsg(path)
        const hty = (await getHty(htyMsg)) || []
        const hty_commits: string[] = []

        if (hty?.length) {
          hty.forEach((item) => {
            const value = item.commit.trim()
            if (hty_commits.includes(value)) return
            hty_commits.push(value)
          })
        }

        setPageState({
          ...(await gitPull(path)),
          hty,
          hty_options: hty_commits.map((value) => ({ value })),
        })
        setLoading(false)
        return htyMsg
      },
    })
  }

  const handlePush = async () => {
    setLoading(true)
    task.add({
      id: 'gitReview__push',
      name: 'Git Review / Push State',
      desc: `Project Name: ${label}`,
      async exec() {
        const res = await gitPush(path, pageState.commitMsg)
        console.log('---', res)
        res ? await query() : setLoading(false)
        return res
      },
    })
  }

  React.useEffect(() => {
    path && query()
  }, [path])

  return {
    init: query,
    setLoading,
    loading,
    handlePush,
    label,
    path,
    fold,
    setFold,
    pageState,
    setPageState,
  }
}

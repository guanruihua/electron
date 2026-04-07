import React from 'react'
import { Hook } from '@/type'
import { useLoading, useSetState } from '@/util'
import { PageState } from './type'
import { getHty, gitPull, gitPush } from './helper'

export const usePageState = (h: Hook) => {
  const { state } = h
  const { label = '', path } = state?.setting?.selectProject || {}

  const [pageState, setPageState] = useSetState<PageState>({
    commitMsg: 'feat: Improve the documentation',
    hty: [],
    hty_options: [],
    tree: [],
    simpleTree: [],
  })

  const [fold, setFold] = React.useState<string[]>([])

  const [loading, setLoading] = useLoading(false)

  const init = async () => {
    setLoading(true)
    const hty = (await getHty(path)) || []
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
  }

  const handlePush = async () => {
    setLoading(true)
    ;(await gitPush(path, pageState.commitMsg)) ? init() : setLoading(false)
  }

  React.useEffect(() => {
    path && init()
  }, [path])

  return {
    init,
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

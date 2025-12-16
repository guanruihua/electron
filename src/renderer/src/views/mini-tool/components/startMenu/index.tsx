import React from 'react'
import './index.less'
import { ObjectType } from '0type'
import { AppCard } from '../app-card'
import { Button } from 'aurad'
import { Flex } from 'aurad'
import { useSetState } from '0hook'
import { classNames } from 'harpe'

export function StartMenu() {
  const [state, setState] = useSetState<{
    select: string[]
    fastStart: ObjectType[]
    startMenu: ObjectType[]
  }>({
    select: [],
    fastStart: [],
    startMenu: [],
  })
  const init = async () => {
    // const val: ObjectType[] = await window.api.getStartMenu()
    // console.log('🚀 ~ Home ~ val:', val)
    const res = await window.api.store({ type: 'get/startMenu' })
    console.log(res)
    setState({
      startMenu: res.data,
    })
  }
  React.useEffect(() => {
    setTimeout(() => {
      init()
    }, 1000)
  }, [])

  return (
    <div className="page__start-menu">
      <h4>最近使用</h4>

      <Flex>
        <Button
          onClick={async () => {
            const res = await window.api.store({
              type: 'get/startMenu',
            })
            console.log(res)
          }}
        >
          get Menu
        </Button>
        <Button
          onClick={() => {
            window.api.store({
              type: 'save/startMenu',
              payload: state.startMenu,
            })
          }}
        >
          test save
        </Button>
        <Button
          onClick={async () => {
            const res = await window.api.invoke('store', {
              type: 'get/data',
            })
            console.log(res)
          }}
        >
          test get
        </Button>
        <Button
          onClick={async () => {
            setState({
              select: [],
              fastStart:
                (state.select
                  ?.map((id) => state.startMenu?.find((_) => _.id === id))
                  .filter(Boolean) as ObjectType[]) || [],
            })
          }}
        >
          Add Fast Start
        </Button>
      </Flex>
      <div className="page__start-menu-container">
        {state?.fastStart?.map((item: ObjectType, i: number) => {
          const { id = i } = item
          return (
            <AppCard
              key={i}
              item={item}
              onClick={() => {
                if (!state.select) {
                  state.select = []
                }
                setState({
                  select: state.select.includes(id)
                    ? state.select.filter((_) => _ !== id)
                    : [id, ...state.select],
                })
              }}
            />
          )
        })}
      </div>
      <div className="page__start-menu-container">
        {state?.startMenu?.map((item: ObjectType, i: number) => {
          const { id = i } = item
          if (item?.fullPath.includes('卸载')) return <React.Fragment key={i} />
          return (
            <AppCard
              key={i}
              item={item}
              className={classNames({
                select: state.select?.includes(id),
              })}
              onClick={() => {
                if (!state.select) {
                  state.select = []
                }
                setState({
                  select: state.select.includes(id)
                    ? state.select.filter((_) => _ !== id)
                    : [id, ...state.select],
                })
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

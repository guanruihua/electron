import { ObjectType } from '0type'
import { AppCard } from '../app-card'
import { Button } from 'aurad'
import { Flex } from 'aurad'
import type { UsePageState } from '../../type'
import { isEffectArray } from 'asura-eye'
import { Grid } from 'aurad'
import { Icon } from './icon'

export function FastStart(props: ObjectType & { h: UsePageState }) {
  const { h } = props
  const { state, setState, handle } = h

  return (
    <Grid className="page__start-menu-fastStart">
      <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
        快速启动组
        <Icon type="setting" />
      </h3>
      {isEffectArray(state?.fastStart) &&
        state?.fastStart
          // .filter((_) => isEffectArray(_?.menu))
          .map((module) => (
            <Flex
              className="page__start-menu-fastStart-module"
              key={module.id}
              alginCenter
            >
              <Flex
                className="page__start-menu-fastStart-module-start"
                alginCenter
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  module.menu.forEach((item) => {
                    window.api.openPath(item.target)
                  })
                }}
              >
                <Icon type="play" />
              </Flex>
              <Flex alginCenter>
                {module.menu.map((item: any) => {
                  return (
                    <AppCard
                      key={item.id}
                      item={item}
                      onClick={() => {
                        window.api.openPath(item.target)
                      }}
                    />
                  )
                })}
              </Flex>
              <Flex
                className="page__start-menu-fastStart-module-del"
                alginCenter
                style={{ cursor: 'pointer' }}
              >
                <Icon
                  type="del"
                  onClick={async () => {
                    console.log('del')
                    if (!isEffectArray(state.fastStart)) return
                    handle.save({
                      type: 'del/fastStart',
                      payload: {
                        id: module.id,
                      },
                    })
                  }}
                />
              </Flex>
            </Flex>
          ))}
      <Flex>
        <Button
          type="primary"
          disabled={!state?.select?.length}
          onClick={async () => {
            handle.save({
              type: 'add/fastStart',
              payload: {
                id: Date.now().toString(),
                menu: state.select
                  ?.map((id) => state.startMenu?.find((item) => item.id === id))
                  .filter(Boolean),
              },
            })
          }}
        >
          Add
        </Button>
        <Button
          disabled={!state?.select?.length}
          onClick={async () => {
            setState({
              select: [],
            })
          }}
        >
          Clear
        </Button>
        {/* <Button
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
        </Button> */}
      </Flex>
    </Grid>
  )
}

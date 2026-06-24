import React from 'react'
import { getReqStatusByUIDs } from './helper'
import { useSysStore } from '@/store/sys'
import { DBName } from '@/store/conf'
import { isObject } from 'asura-eye'
import { Item } from './item'
import './index.less'
import { ObjectType } from '0type'
import { isChange } from '@/util'

const tableName = 'cache'
const uid = 'Live-broadcast'
export function LiveBroadcast() {
  const sys = useSysStore()
  const { env } = sys || {}
  const { bilibili_up_UIDs = [] } = env || {}

  const [map, setMap] = React.useState<ObjectType<ObjectType<any>>>({})

  const query = async (): Promise<void> => {
    const res = await window.api.db({
      action: 'find',
      tableName,
      DBName,
      payload: {
        uid,
      },
    })

    if (res.error) return
    const data = res?.data?.at(0)?.data
    if (isObject(data)) setMap(data)
    return
  }

  const reload = async (list: number[] = bilibili_up_UIDs) => {
    const UIDs: any[] = []
    list.map((uid) => {
      if (UIDs.includes(uid)) return
      UIDs.push(uid)
    })

    const res = await getReqStatusByUIDs(UIDs)
    if (!isObject(res)) return
    const newMap = {
      ...map,
      ...res,
    }
    // console.log(res)
    setMap(newMap)
    if (isChange(newMap, map))
      await window.api.db({
        action: 'update',
        tableName,
        DBName,
        payload: {
          uid,
          data: newMap,
        },
      })
  }

  const init = async () => {
    await query()
    await reload()
  }

  React.useEffect(() => {
    sys.initSuccess && init()
  }, [sys.initSuccess])

  const list = isObject(map)
    ? Object.values(map)
        .map((_) => {
          if (_.live_status === 1) _.sort = 10
          else if (_.live_status === 2) _.sort = 5
          else _.sort = 1

          return _
        })
        .sort((a, b) => b.sort - a.sort)
    : []

  return (
    <div
      className="live-broadcast"
      data-hidden={sys.initSuccess === false || !bilibili_up_UIDs?.length}
    >
      {list.map((data, i) => (
        <Item
          key={i}
          data={data}
          i={i}
          updateRoom={async () => await reload([data.uid])}
        />
      ))}
    </div>
  )
}

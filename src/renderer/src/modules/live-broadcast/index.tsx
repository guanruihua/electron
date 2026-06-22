import React from 'react'
import { getReqStatus } from './helper'
import { useSysStore } from '@/store/sys'
import { DBName } from '@/store/conf'
import { isArray, isObject } from 'asura-eye'
import { Item } from './item'
import './index.less'

const tableName = 'Live-broadcast'

export function LiveBroadcast() {
  const sys = useSysStore()
  const { env } = sys || {}
  const { room_ids = [] } = env || {}

  const [list, setList] = React.useState<any[]>([])

  const updateRoom = async (room_id: number) => {
    if (!room_id) return
    const data = await getReqStatus(room_id)
    if (data) {
      data.id = room_id
      await window.api.db({
        action: 'update',
        tableName,
        DBName,
        payload: data,
      })
    }
  }

  const query = async (): Promise<any[]> => {
    const res = await window.api.db({
      action: 'find',
      tableName,
      DBName,
    })
    if (res.error) return []
    const list = res.data || []
    if (isArray(list)) {
      setList(list)
      return list
    }
    return []
  }

  const init = async () => {
    if (!isArray(room_ids)) return
    const list = await query()
    if (list.length !== room_ids.length) {
      const list_room_ids: number[] = list.map((_) => _.room_id)
      for (const room_id of room_ids) {
        if (list_room_ids.includes(room_id)) continue
        await updateRoom(room_id)
      }
      await query()
    }
  }

  React.useEffect(() => {
    sys.initSuccess && init()
  }, [sys.initSuccess])

  return (
    <div
      className="live-broadcast"
      data-hidden={sys.initSuccess === false || !room_ids?.length}
    >
      {isArray(list) &&
        list.map((data, i) => (
          <Item key={i} data={data} i={i} updateRoom={updateRoom} />
        ))}
    </div>
  )
}

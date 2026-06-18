import React from 'react'
import { getReqStatus } from './helper'
import { useLoading, useSetState } from '@/util'
import { DiagonalLoading, Icon } from '@/components'
import dayjs from 'dayjs'
import { Button } from 'antd'
import { useSysStore } from '@/store/sys'
import { DBName } from '@/store/conf'
import './index.less'
import { isArray, isNumber } from 'asura-eye'

const LiveStatus = ['未开播', '直播中', '轮播中']
const tableName = 'Live-broadcast'

export function LiveBroadcast() {
  const sys = useSysStore()
  const { env } = sys || {}
  const { uid, room_ids = [] } = env || {}
  // console.log(sys.userInfo)

  const [loading, setLoading] = useLoading()
  const [state, setState] = useSetState({})

  const reload = async (room_id: number) => {
    if (!isNumber(room_id)) return

    const res = await window.api.db({
      action: 'find',
      tableName,
      DBName,
      payload: { uid },
    })
    const live = res?.data?.at(0)

    const newState = live?.info || {}

    const data = await getReqStatus(room_id)
    if (data) newState[room_id] = data
    await window.api.db({
      action: 'update',
      tableName,
      DBName,
      payload: { id: live?.id, uid, info: newState },
    })
    setState(newState)
  }

  const init = async () => {
    if (!isArray(room_ids)) return

    const res = await window.api.db({
      action: 'find',
      tableName,
      DBName,
      payload: { uid },
    })
    const live = res?.data?.at(0)

    const newState = live?.info || {}
    setState(newState)

    for (const room_id of room_ids) {
      if (state[room_id]) continue
      const data = await getReqStatus(room_id)
      if (data) newState[room_id] = data
    }
    await window.api.db({
      action: 'update',
      tableName,
      DBName,
      payload: { id: live?.id, uid, info: newState },
    })
    setState(newState)
  }

  React.useEffect(() => {
    sys.initSuccess && init()
  }, [sys.initSuccess])

  return (
    <div
      className="live-broadcast"
      data-hidden={sys.initSuccess === false || !room_ids?.length}
    >
      {room_ids.map((room_id) => {
        const data = state[room_id]
        const {
          live_time,
          live_status = 0,
          title,
          description,
          parent_area_name,
          area_name,
          user_cover,
        }: any = data || {}

        const badges = [parent_area_name, area_name].filter(Boolean)
        const getDuration = () => {
          if (live_status !== 1) return ''
          const diff = dayjs().valueOf() - dayjs(live_time).valueOf()
          const minutes = Math.floor(diff / 1000 / 60)
          const h = Math.floor(minutes / 60)
          const m = Math.floor(minutes - h * 60)
          if (h && m) return `${h}h${m}m`
          if (h && !m) return `${h}h`
          if (!h && m) return `${m}m`
          return ''
        }
        const duration = getDuration()
        if (!data) return <React.Fragment key={room_id} />
        return (
          <div key={room_id} className="live-broadcast-item">
            {data ? (
              <div
                className="live-broadcast-item-content"
                data-live-status={live_status}
              >
                <img
                  className="bg"
                  src={user_cover}
                  referrerPolicy="no-referrer"
                />
                <div className="header">
                  <div className="live_status">
                    <div className="dot"></div>
                    <div className="content">{LiveStatus[live_status]}</div>
                  </div>
                  <div className="badge">
                    {badges.map((badge, i) => {
                      return (
                        <div key={i} className="badge-item">
                          {i !== 0 && <div>/</div>}
                          <div>{badge}</div>
                        </div>
                      )
                    })}
                    <Button
                      loading={loading}
                      icon={<Icon type="reload" style={{ fontSize: 16 }} />}
                      onClick={() => setLoading(reload(room_id))}
                    />
                  </div>
                </div>

                <div className="title">{title}</div>
                <div className="desc">{description}</div>
                {live_status === 1 && (
                  <>
                    <div className="live_time">开播时间: {live_time}</div>
                    <div className="live_duration">直播时长: {duration}</div>
                  </>
                )}
              </div>
            ) : (
              <DiagonalLoading />
            )}
          </div>
        )
      })}
    </div>
  )
}

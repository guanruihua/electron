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
import { ObjectType } from '0type'

const LiveStatus = ['未开播', '直播中', '轮播中']
const tableName = 'Live-broadcast'

const getDuration = (live_status: any, live_time: any) => {
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

export function LiveBroadcast() {
  const date = dayjs().format('YYYY-MM-DD')
  const sys = useSysStore()
  const { env } = sys || {}
  const { room_ids = [] } = env || {}

  const [loading, setLoading] = useLoading()
  const [list, setList] = useSetState([])


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

  const query = async () => {
    const res = await window.api.db({
      action: 'find',
      tableName,
      DBName,
    })
    if (res.error) return []
    const list = res.data || []
    setList(list)
    return list
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
      {isArray(list) && list.map((data, i) => {
        const {
          id = i,
          room_id,
          live_time,
          live_status = 0,
          title,
          description,
          parent_area_name,
          area_name,
          user_cover,
        }: any = data || {}

        const badges = [parent_area_name, area_name].filter(Boolean)

        const duration = getDuration(live_status, live_time)
        if (!data) return <React.Fragment key={id} />
        return (
          <div key={id} className="live-broadcast-item">
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
                      onClick={() => setLoading(updateRoom(room_id))}
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

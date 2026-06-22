import dayjs from 'dayjs'
import React from 'react'
import { DiagonalLoading, Icon } from '@/components'
import { Button } from 'antd'
import { useLoading } from '@/util'

export interface ItemProps {
  data: any
  i: number
  updateRoom(room_id: number): Promise<void>
  [key: string]: any
}

const LiveStatus = ['未开播', '直播中', '轮播中']

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

export function Item(props: ItemProps) {
  const { data, i, updateRoom } = props
  const [loading, setLoading] = useLoading()

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
          <img className="bg" src={user_cover} referrerPolicy="no-referrer" />
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
}

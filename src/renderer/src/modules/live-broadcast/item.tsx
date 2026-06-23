import React from 'react'
import { DiagonalLoading, Icon, Img } from '@/components'
import { Button } from 'antd'
import { useLoading } from '@/util'

export interface ItemProps {
  data: any
  i: number
  updateRoom(room_id: number): Promise<void>
  [key: string]: any
}

const LiveStatus = ['未开播', '直播中', '轮播中']

export function Item(props: ItemProps) {
  const { data, i, updateRoom } = props
  const [loading, setLoading] = useLoading()

  const {
    id = i,
    room_id,
    uname,
    face,
    live_status = 0,
    title,
    area_v2_parent_name,
    area_v2_name,
    cover_from_user,
  }: any = data || {}
  // console.log(data)

  const badges = [area_v2_parent_name, area_v2_name].filter(Boolean)

  if (!data) return <React.Fragment key={id} />
  return (
    <div
      key={id}
      className="live-broadcast-item"
      data-live-status={live_status}
    >
      <Img className="bg" src={cover_from_user} referrerPolicy="no-referrer" />
      <div className="header">
        {face && (
          <div className="b-up-info">
            <Img
              className="b-up-logo"
              referrerPolicy="no-referrer"
              src={face}
            />
            <div>{uname}</div>
          </div>
        )}
        <div className="header-right">
          <div className="live_status">
            <div className="dot"></div>
            <div className="content">{LiveStatus[live_status]}</div>
          </div>
          <Button
            loading={loading}
            icon={<Icon type="reload" style={{ fontSize: 16 }} />}
            onClick={() => setLoading(updateRoom(room_id))}
          />
        </div>
      </div>

      <div className="title">{title}</div>
      <div className="badge">
        {badges.map((badge, i) => {
          return (
            <div key={i} className="badge-item">
              {i !== 0 && <div>/</div>}
              <div>{badge}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

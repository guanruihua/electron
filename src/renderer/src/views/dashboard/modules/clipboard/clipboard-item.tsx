import { ObjectType } from '0type'
import { Icon } from '@/components'
import { formatRelativeTime } from './helper'

interface Props {
  item: ObjectType
  pageState: ObjectType
  handleSelf: ObjectType<any>
}

export function ClipboardItem(props: Props) {
  const { pageState, handleSelf, item } = props
  const { edit = false } = pageState
  const { type, data, time, star = 0, num } = item
  const now = Date.now()

  return (
    <div className="clipboard-item" data-star={!!star}>
      <div className="clipboard-item-content">
        {type === 'image' && (
          <div
            className="content image"
            onClick={(e) => {
              e.preventDefault()
              if (edit) return
              handleSelf.copy(item)
            }}
          >
            <img src={data} alt="image" />
          </div>
        )}
        {type === 'text' && (
          <div
            className="content text"
            title={data}
            onClick={(e) => {
              e.preventDefault()
              if (edit) return
              handleSelf.copy(item)
            }}
          >
            {data.length < 1000 ? data : `${data.slice(0, 1000)}...`}
          </div>
        )}
        <div className="btns">
          {edit && (
            <Icon
              className="remove"
              type="close"
              onClick={() => handleSelf.del(item)}
            />
          )}
          {(star || edit) && (
            <Icon
              className="star"
              type={star ? 'star-fill' : 'star'}
              onClick={() => handleSelf.star(item)}
            />
          )}
        </div>
      </div>
      <div className="clipboard-item-footer">
        <div className="data-time">{formatRelativeTime(now, time)}</div>
        <div className="clipboard-item-footer-right">
          <div className="data-count">
            {type === 'text' ? `Length: ${data.length}` : 'File'}
          </div>
          <div className="data-num">{num}</div>
        </div>
      </div>
    </div>
  )
}

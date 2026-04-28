import { IconMap } from '../../helper'
import './review.less'
import ReviewDir from './review-dir'
import ReviewFile from './review-file/review-file'
import { useFRMStore } from '../../store'

export default function Review() {
  const frm = useFRMStore()
  const { select } = frm || {}
  const { type, path, fileType = '', name } = select || {}

  return (
    <div className="frm-review" data-hidden={!path}>
      <div className="frm-review-header">
        {IconMap[fileType] || IconMap.file}
        <span>{name}</span>
      </div>
      {type === 'dir' && <ReviewDir />}
      {type === 'file' && <ReviewFile />}
    </div>
  )
}

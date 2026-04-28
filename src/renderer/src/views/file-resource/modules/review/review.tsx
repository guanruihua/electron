import { PageState, HandlePage, FileNode, IconMap } from '../../helper'
import './review.less'
import ReviewDir from './review-dir'
import ReviewFile from './review-file/review-file'

type Props = {
  pageState: PageState
  handlePage: HandlePage
}

export default function Review(props: Props) {
  const { pageState } = props
  // console.log(pageState.select)
  const { type } = pageState?.select || {}
  const { select } = pageState || {}

  return (
    <div className="frm-review" data-hidden={!pageState?.select?.path}>
      <div className="frm-review-header">
        {IconMap[select?.fileType || ''] || IconMap.file}
        <span>{select?.name}</span>
      </div>
      {type === 'dir' && <ReviewDir {...props} />}
      {type === 'file' && <ReviewFile {...props} />}
    </div>
  )
}

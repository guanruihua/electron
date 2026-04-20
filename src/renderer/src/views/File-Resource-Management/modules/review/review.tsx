import { PageState, HandlePage } from '../../helper'
import './review.less'
import ReviewDir from './review-dir'
import ReviewFile from './review-file/review-file'

type Props = {
  pageState: PageState
  handlePage: HandlePage
}

export default function Review(props: Props) {
  const { pageState } = props
  console.log(pageState.select)
  const { type } = pageState?.select || {}
  return (
    <div className="frm-review frm-card" data-hidden={!pageState?.select?.path}>
      {type === 'dir' && <ReviewDir {...props} />}
      {type === 'file' && <ReviewFile {...props} />}
    </div>
  )
}

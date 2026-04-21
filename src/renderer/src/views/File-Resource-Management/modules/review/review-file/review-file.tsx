import { Image } from 'antd'
import { PageState, FileNode, HandlePage, IconMap } from '../../../helper'
import ReviewFile_JSON from './json/json'
import ReviewFile_SVG from './svg/svg'

type Props = {
  pageState: PageState
  handlePage: HandlePage
}

export default function ReviewFile(props: Props) {
  const { pageState } = props
  const { select } = pageState || {}
  const { path, fileType } = (select || {}) as FileNode


  const Render = () => {
    if (fileType === 'image')
      return (
        <div
          className="image-review"
          style={{
            overflowY: 'auto',
          }}
        >
          <Image
            style={{
              objectFit: 'contain',
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            src={`file://${path}`}
          />
        </div>
      )
    if (fileType === 'json')
      return <ReviewFile_JSON file={select as FileNode} />
    if (fileType === 'svg')
      return <ReviewFile_SVG file={select as FileNode} />

    return (
      <div style={{ textAlign: 'center', paddingTop: 100 }}>No Review ...</div>
    )
  }

  return (
    <div
      className="frm-review-layout frm-review-layout__file"
      data-file-type={fileType}
    >
      <div className="frm-review-container">
        <Render />
      </div>
      {/* <div className="frm-review-footer"></div> */}
    </div>
  )
}

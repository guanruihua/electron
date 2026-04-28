import { Image } from 'antd'
import { FileNode } from '../../../helper'
import ReviewFile_JSON from './json/json'
import ReviewFile_SVG from './svg/svg'
import ReviewFile_md from './md/md'
import { useFRMStore } from '@/views/file-resource/store'

export default function ReviewFile() {
  const frm = useFRMStore()
  const { select } = frm || {}
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
    if (fileType === 'svg') return <ReviewFile_SVG file={select as FileNode} />
    if (fileType === 'txt' || fileType === 'md') return <ReviewFile_md file={select as FileNode} />
    console.warn('select: ', select)
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

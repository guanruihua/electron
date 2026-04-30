import { FileNode, IconMap } from '../../helper'
import { useFRMStore } from '../../store'
import './review.less'
import ReviewDir from './review-dir'
// import { Select } from 'antd'
// import { isArray } from 'asura-eye'
import { FileRender } from './file-render'

export default function Review() {
  const frm = useFRMStore()
  const { select } = frm || {}
  const { type, path, fileType = '', name } = select || {}

  // const Options = {
  //   txt: [{ value: 'TXT' }, { value: 'MD' }],
  //   md: [{ value: 'MD' }, { value: 'TXT' }],
  // }
  // const options = Options[fileType]

  return (
    <div className="frm-review" data-hidden={!path}>
      <div className="frm-review-header">
        {IconMap[fileType] || IconMap.file}
        <span>{name}</span>
        {/* <div className="right">
          {isArray(options) && <Select size="small" options={options} />}
        </div> */}
      </div>
      {type === 'dir' && <ReviewDir />}
      {type === 'file' && (
        <div
          className="frm-review-layout frm-review-layout__file"
          data-file-type={fileType}
        >
          <div className="frm-review-container">
            <FileRender select={select as FileNode} />
          </div>
        </div>
      )}
    </div>
  )
}

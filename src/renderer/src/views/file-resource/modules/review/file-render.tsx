import { FileNode } from '@/type'
import { Image } from 'antd'
import ReviewFile_JSON from './review-file/json/json'
import ReviewFile_SVG from './review-file/svg/svg'
import ReviewFile_md from './review-file/md/md'

export const FileRender = ({ select }: { select: FileNode }) => {
  const { fileType, path } = select
  
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
  if (fileType === 'json') return <ReviewFile_JSON file={select as FileNode} />
  if (fileType === 'svg') return <ReviewFile_SVG file={select as FileNode} />
  if (['txt', 'md'].includes(fileType as string))
    return <ReviewFile_md file={select as FileNode} />

  console.warn('select: ', select)

  return (
    <div style={{ textAlign: 'center', paddingTop: 100 }}>No Review ...</div>
  )
}

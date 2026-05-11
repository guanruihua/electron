import { FileNode } from '@/type'
import { Button, Image } from 'antd'
import ReviewFile_JSON from './review-file/json/json'
import ReviewFile_SVG from './review-file/svg/svg'
import ReviewFile_md from './review-file/md/md'
import { Icon } from '@/components'
import { useLoadings } from '@/util'
import ReviewFile_Music from './review-file/music/music'

export const FileRender = ({ select }: { select: FileNode }) => {
  const { fileType, path, name } = select
  const [loadings, setLoadings] = useLoadings({
    run: false,
    vscode: false,
    cmd: false,
  })

  const run = async () => {
    setLoadings(window.api.invoke('cmd', `start "" "${path}"`), 'run')
  }
  const vscode = async () => {
    setLoadings(window.api.invoke('cmd', `code "${path}"`), 'vscode')
  }
  const cmd = async () => {
    setLoadings(
      window.api.invoke('cmd', `start cmd /k "cd /d \"${path}\""`),
      'cmd',
    )
  }
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
  if (['music'].includes(fileType as string))
    return <ReviewFile_Music file={select as FileNode} />
  if (['lnk'].includes(fileType as string))
    return (
      <div style={{ textAlign: 'center', paddingTop: 100 }}>
        <div className='file-name'>{name}</div>
        <div style={{ marginBottom: 10, fontSize: 14 }}>快捷方式</div>
        <div className="file-review-btns">
          <Button
            className="file-review-start-btn"
            icon={<Icon type="run" />}
            loading={loadings.run}
            onClick={run}
          >
            Run / Open
          </Button>
        </div>
      </div>
    )
  console.warn('select: ', select)

  return (
    <div style={{ textAlign: 'center', paddingTop: 100 }}>
      <div className='file-name'>{name}</div>
      <div className="file-review-btns">
        <Button
          className="file-review-start-btn"
          icon={<Icon type="run" />}
          loading={loadings.run}
          onClick={run}
        >
          Run / Open
        </Button>
        <Button
          className="file-review-start-btn"
          icon={<Icon type="vscode" />}
          loading={loadings.vscode}
          onClick={vscode}
        >
          VSCode Open
        </Button>
        <Button
          className="file-review-start-btn"
          loading={loadings.cmd}
          icon={<Icon type="cmd" />}
          onClick={cmd}
        >
          Cmd Open
        </Button>
      </div>
      <div>No Review ...</div>
    </div>
  )
}

import { FileNode } from '@/type'
// import './music.less'
import AudioPlayer from './audio-player'

type Props = {
  file: FileNode
}

export default function ReviewFile_Music(props: Props) {
  const { file } = props
  const { path, name } = file
  const src = `file://${path}`

  return (
    <div className="frm-review-file-music">
      <div className="frm-review-file-music-render">
        <AudioPlayer key={src} src={src} title={name} />
        {/* <audio ref={ref} controls key={src}>
          <source src={src} type="audio/mpeg" />
          <source src={src} type="audio/ogg" />
          <source src={src} type="audio/wav" />
          <source src={src} type="audio/aac" />
          <source src={src} type="audio/mp3" />
          您的浏览器不支持 audio 元素。
        </audio> */}
        {/* 视频 */}
        {/* <video>
          <source src={src} type="video/mp4" />
          <source src={src} type="video/webm" />
          <source src={src} type="video/ogg" />
          您的浏览器不支持 video 标签。
        </video> */}

        
      </div>
    </div>
  )
}

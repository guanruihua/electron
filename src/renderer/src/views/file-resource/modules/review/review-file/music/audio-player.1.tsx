// AudioPlayer.tsx
import React, { useRef, useEffect } from 'react'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import './audio-player.less'
import { Button } from 'antd'

interface AudioPlayerProps {
  src: string // 音频文件地址
  title?: string // 可选标题
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
  // 1. 为 <audio> 标签创建一个 ref
  const audioRef = useRef<HTMLAudioElement>(null)
  // 2. 存储 Plyr 实例
  const plyrInstance = useRef<Plyr | null>(null)

  // 3. 在组件挂载后初始化 Plyr
  useEffect(() => {
    if (!audioRef.current) return

    // 初始化 Plyr 播放器，可以在此传入配置
    plyrInstance.current = new Plyr(audioRef.current, {
      controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
    })

    // 可以在这里添加事件监听
    plyrInstance.current.on('play', () => console.log('正在播放:', title))
    plyrInstance.current.on('ended', () => console.log('播放完成:', title))

    // 4. 清理函数：组件卸载时销毁播放器实例
    return () => {
      if (plyrInstance.current) {
        plyrInstance.current.destroy()
      }
    }
  }, [src, title])

  // 5. 当音频地址变化时，更新播放器源
  useEffect(() => {
    if (plyrInstance.current && audioRef.current) {
      audioRef.current.load() // 重新加载音频
    }
  }, [src, plyrInstance.current])

  return (
    <div className="audio-player">
      <div className="file-name">{title}</div>
      {/* 6. 标准的 audio 标签，绑定 ref */}
      <audio ref={audioRef}>
        <source src={src} type="audio/mpeg" />
        <source src={src} type="audio/ogg" />
        <source src={src} type="audio/wav" />
        <source src={src} type="audio/aac" />
        <source src={src} type="audio/mp3" />
        您的浏览器不支持 audio 元素。
      </audio>
      <Button
        onClick={() => {
          if (!audioRef.current) return
          const audio = audioRef.current
          console.log(
            //
            audio.volume,
            audio.duration / 60,
            audio.currentTime / 60,
          )
        }}
      >
        Get
      </Button>
    </div>
  )
}

export default AudioPlayer

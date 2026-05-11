import React from 'react'
// import './audio-player.less'
import { useHowler } from './useHowler'
import { Button } from 'antd'
import { PlayerCard } from './player-card'

interface AudioPlayerProps {
  src: string // 音频文件地址
  title?: string // 可选标题
}
const tracks = [
  {
    id: 1,
    title: 'Track One',
    src: 'file://D:\\Music\\주영 _ HOYO-MiX - WHITE NIGHT (不眠之夜).flac',
    name: 'Lost in the City Lights',
    artist: 'Sarah Johnson',
    cover: 'https://picsum.photos/id/100/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    favorite: false,
  },
  {
    id: 2,
    title: 'Track Two',
    src: 'file://D:\\Music\\静悄悄 - 曲肖冰_EM.lrc',
    name: 'Midnight Drive',
    artist: 'The Midnight Riders',
    cover: 'https://picsum.photos/id/101/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    favorite: true,
  },
]

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0)
  const currentTrack = tracks[currentTrackIndex]
  const { play, pause, setVolume, seekTo, isPlaying, duration, seek } =
    useHowler(currentTrack.src)

  const handlePrev = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1)
    }
  }

  return (
    <div className="audio-player">
      <div className="file-name">{title}</div>
      <PlayerCard
        prevTrack={handlePrev}
        nextTrack={handleNext}
        playPause={() => {
          if (isPlaying) pause()
          else play()
        }}
      />

      {/* <div>
        <Button onClick={() => play()}>▶️ 播放</Button>
        <Button onClick={() => pause()}>⏸️ 暂停</Button>
        <Button onClick={handlePrev} disabled={currentTrackIndex === 0}>
          ⏮️ 上一首
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentTrackIndex === tracks.length - 1}
        >
          ⏭️ 下一首
        </Button>
      </div> */}
      <div>
        音量：
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </div>
      <div>
        播放进度：
        <input
          type="range"
          min="0"
          max={duration}
          step="1"
          value={seek}
          onChange={(e) => seekTo(parseInt(e.target.value, 10))}
        />
      </div>
      <div>
        当前进度: {Math.floor(seek)} 秒 / 总时长: {Math.floor(duration)} 秒
      </div>
    </div>
  )
}

export default AudioPlayer

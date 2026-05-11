// import './player-card.less'
import { Icon } from '@/components'

export interface PlayerCardProps {
  // 播放/暂停
  playPause(): void

  // 下一首
  nextTrack(): void

  // 上一首
  prevTrack(): void
  // 收藏切换
  toggleFavorite(): void

  // 点击进度条跳转
  clickProgress(): void

  [key: string]: any
}

// 默认歌曲数据（若未通过 props 传入）
const defaultTracks = [
  {
    name: 'Lost in the City Lights',
    artist: 'Sarah Johnson',
    cover: 'https://picsum.photos/id/100/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    favorite: false,
  },
  {
    name: 'Midnight Drive',
    artist: 'The Midnight Riders',
    cover: 'https://picsum.photos/id/101/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    favorite: true,
  },
  {
    name: 'Echoes of Time',
    artist: 'Elena Rivers',
    cover: 'https://picsum.photos/id/102/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    favorite: false,
  },
]
export function PlayerCard(props: PlayerCardProps) {
  const {
    playPause,
    nextTrack,
    prevTrack,
    toggleFavorite,
    clickProgress,
    currentTrackIndex = 0,
    currentTrack = defaultTracks[0],
    isPlaying = false,
    duration = 0,
    currentTime = 0,
    barWidth = '0%',
    transitionName = 'slide',
    favorite = false
  } = props

  // 格式化时间 (秒 -> mm:ss)
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="player-card">
      <div className="wrapper">
        <div className="player">
          <div className="player__top">
            <div className="player-cover">
              <div
                key={currentTrackIndex}
                className={`player-cover__item ${transitionName}`}
                style={{ backgroundImage: `url(${currentTrack.cover})` }}
              />
            </div>
            <div className="player-controls">
              <div
                className={`player-controls__item -favorite ${favorite ? 'active' : ''}`}
                onClick={toggleFavorite}
              >
                {favorite ? <Icon type="heart" /> : <Icon type="heart-o" />}
              </div>
              <a
                href={currentTrack.url}
                target="_blank"
                rel="noopener noreferrer"
                className="player-controls__item"
              >
                <Icon type="link" />
              </a>
              <div className="player-controls__item" onClick={prevTrack}>
                <Icon type="prev" />
              </div>
              <div
                className="player-controls__item -xl js-play"
                onClick={playPause}
              >
                {isPlaying ? <Icon type="pause" /> : <Icon type="play" />}
              </div>
              <div className="player-controls__item" onClick={nextTrack}>
                <Icon type="next" />
              </div>
            </div>
          </div>
          <div className="progress">
            <div className="progress__top">
              <div className="album-info">
                <div className="album-info__name">{currentTrack.artist}</div>
                <div className="album-info__track">{currentTrack.name}</div>
              </div>
              <div className="progress__duration">{formatTime(duration)}</div>
            </div>
            <div
              className="progress__bar"
              onClick={clickProgress}
            >
              <div
                className="progress__current"
                style={{ width: barWidth }}
              ></div>
            </div>
            <div className="progress__time">{formatTime(currentTime)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

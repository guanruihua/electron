import React from 'react'
import { useHowler } from './useHowler'
import './player-card.less'
import { Icon } from '@/components'
import { Slider } from 'antd'
import { CSSProperties } from 'react'
import { Volume } from './volume'

export interface PlayerCardProps {
  src: string
  // 下一首
  nextTrack(): void
  // 上一首
  prevTrack(): void
  [key: string]: any
}

// 格式化时间 (秒 -> mm:ss)
const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function PlayerCard(props: PlayerCardProps) {
  const { src, nextTrack, prevTrack, currentTrackIndex = 0 } = props

  const {
    state,
    setState,
    play,
    pause,
    setVolume,
    seekTo,
    duration,
    seek,
    currentTime,
  } = useHowler(src)
  
  return (
    <div className="player-card">
      <div className="wrapper">
        <div className="player">
          <div className="player__top">
            <div className="player-cover">
              <div
                key={currentTrackIndex}
                className={`player-cover__item slide`}
                style={{ backgroundImage: `url(${state.cover!})` }}
              />
            </div>
            <div className="player-controls">
              <div
                className={`player-controls__item -favorite ${state.favorite ? 'active' : ''}`}
                onClick={() => {
                  setState({
                    favorite: !state.favorite,
                  })
                }}
              >
                {state.favorite ? (
                  <Icon type="heart" />
                ) : (
                  <Icon type="heart-o" />
                )}
              </div>
              <a
                href={state.url}
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
                onClick={() => {
                  if (state.isPlaying) pause()
                  else play()
                }}
              >
                {state.isPlaying ? <Icon type="pause" /> : <Icon type="play" />}
              </div>
              <div className="player-controls__item" onClick={nextTrack}>
                <Icon type="next" />
              </div>
            </div>
          </div>
          <div className="progress">
            <div className="progress__top">
              <div className="album-info">
                <div className="album-info__name">{state.artist}</div>
                <div className="album-info__track">{state.name}</div>
              </div>
            </div>
            <div className="progress__bar">
              <div className="progress__duration">{formatTime(duration)}</div>
              <Slider
                min={0}
                max={duration}
                tooltip={{
                  formatter: formatTime,
                }}
                onChange={(v) => {
                  seekTo(v)
                }}
                value={seek}
                style={
                  {
                    '--ant-slider-rail-bg': '#d0d8e6',
                    '--ant-slider-rail-hover-bg': '#d0d8e6',
                    '--ant-slider-rail-size': '7px',
                    '--ant-color-bg-elevated': '#a3b3ce',
                    '--ant-slider-track-bg': '#a3b3ce',
                    '--ant-slider-track-hover-bg': '#a3b3ce',
                    '--ant-slider-handle-color': '#a3b3ce',
                    '--ant-slider-handle-hover-color': '#a3b3ce',
                    '--ant-color-primary-border-hover': '#a3b3ce',
                    '--ant-slider-handle-active-color': '#a3b3ce',
                  } as CSSProperties
                }
              />
              <Volume volume={state.volume} setVolume={setVolume} />
            </div>
            <div className="progress__time">{formatTime(currentTime)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

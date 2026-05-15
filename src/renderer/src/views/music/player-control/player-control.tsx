import './player-control.less'
import { CSSProperties } from 'react'
import { Slider } from 'antd'
import { Icon } from '@/components'
import { Volume } from './volume'
import { PlaybackMode } from './playback-mode'
import { formatTime } from '../helper/helper'

export interface PlayerControlProps {
  music: any
  [key: string]: any
}

export function PlayerControl(props: PlayerControlProps) {
  const { music } = props
  const {
    isPlaying,
    state,
    duration,
    seek,
    setState,
    setVolume,
    seekTo,
    play,
    pause,
    prev,
    next,
  } = music
  const { name } = state.song
  console.log(state.index,  name)

  return (
    <div className="music-player-control">
      <div className="music-player-control-container">
        <div className="left">
          <Icon type="prev" onClick={prev} />
          {isPlaying ? (
            <Icon type="pause" onClick={pause} />
          ) : (
            <Icon type="play" onClick={play} />
          )}
          <Icon type="next" onClick={next} />
        </div>
        <div className="center">
          <div className="info">
            <div className="name">{name}</div>
            <div className="time">
              {`${formatTime(seek)} / ${formatTime(duration)}`}
            </div>
          </div>
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
                width: '100%',
                '--ant-slider-rail-bg': '#d0d8e6',
                '--ant-slider-rail-hover-bg': '#d0d8e6',
                '--ant-slider-rail-size': '3px',
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
        </div>
        <div className="right">
          {/* {state.favorite ? <Icon type="heart" /> : <Icon type="heart-o" />} */}
          <PlaybackMode
            type={state.playbackMode as any}
            onClick={() => {
              const list = ['sequence', 'repeat', 'repeat-one', 'shuffle']
              const findIndex =
                list.findIndex((_) => _ === state.playbackMode) || 0
              setState({
                playbackMode:
                  findIndex === list.length - 1
                    ? list.at(0)
                    : list.at(findIndex + 1),
              })
            }}
          />
          <Volume volume={state.volume} setVolume={setVolume} />
        </div>
      </div>
    </div>
  )
}

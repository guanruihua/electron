import { useSysStore } from '@/store/sys'
import './audio-player.less'
import './music.less'
import { Icon } from '@/components'
import { PlayerControl } from './player-control/player-control'
import { useMusic } from './use-music'
import { formatTime } from './helper/helper'

export default function MusicPlayer() {
  const sys = useSysStore()
  const music = useMusic(sys)
  const { state, songList, handlePlaySong } = music

  return (
    <div className="page-music-player">
      <div className="page-music-player-header">
        <div className="header-item">{`ALL (${songList.length})`}</div>
        {/* <div className="header-item">{`Play List (${playList.length})`}</div> */}
      </div>
      <div className="play-list">
        <div className="play-list-header">
          <div className="song-name">歌曲</div>
          <div className="length">时长</div>
          <div className="handle"></div>
        </div>
        <div className="play-list-content">
          {songList.map((item, i) => {
            const { name } = item
            return (
              <div
                key={i}
                className="song song-item"
                data-index={i}
                data-play={state.index === i}
              >
                <div className="song-name">{name}</div>
                <div className="length">
                  {formatTime(item?.['music_metadata'].duration)}
                </div>
                <div className="handle">
                  <div
                    className="play"
                    onClick={() => {
                      handlePlaySong(item, i)
                    }}
                  >
                    <Icon type="play" />
                  </div>
                  {/* <div className="add">
                    <Icon type="add" />
                  </div> */}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <PlayerControl music={music} />
    </div>
  )
}

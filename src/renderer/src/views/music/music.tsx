import './music.less'
import React from 'react'
import './audio-player.less'
import { Button } from 'antd'
import { PlayerCard } from './player-card/player-card'

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

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0)
  const currentTrack = tracks[currentTrackIndex]


  const prevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1)
    }
  }

  const nextTrack = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1)
    }
  }

  const props = {
    prevTrack,
    nextTrack,
  }
  return (
    <div className="page-music-player">
      <div style={{ zoom: '.7' }}>
        <PlayerCard
        src='file://D:\\Music\\주영 _ HOYO-MiX - WHITE NIGHT (不眠之夜).flac'
          //
          {...props}
        />
      </div>
    </div>
  )
}

import React from 'react'
import { Button } from 'antd'
import { PlayerCard } from './player-card/player-card'
import { useSysStore } from '@/store/sys'
import './audio-player.less'
import './music.less'
import { FileNode } from '@/type'
import { isString } from 'asura-eye'
import { Icon } from '@/components'

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

type Song = {
  uid: string
  songName: string
  singer: string
  parentPath: string
  path: string
}

export default function MusicPlayer() {
  const sys = useSysStore()
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0)

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

  const [playList, setPlayList] = React.useState<Song[]>([])
  const [allPlayList, setAllPlayList] = React.useState<Song[]>([])

  const handlePlay = (item: Song)=>{
    console.log(item)
  }

  const load = async () => {
    if (!sys.initSuccess || !sys.path) return
    console.log(sys)
    const res = await window.api.fs('readCurrentDir', {
      path: 'D:\\Music',
    })
    /**
     * 音乐: .ogg,
     * 歌词: .lrc
     */
    const list: Song[] = []
    const reg = /\.ogg$/
    res.forEach((item) => {
      const { name, path, parentPath } = item
      if (!isString(name)) return
      if (reg.test(name)) {
        const song: Song = {
          uid: path,
          songName: name,
          singer: '',
          path,
          parentPath,
        }
        if (name.includes(' - ')) {
          const [singer, songName] = name.replace(reg, '').split(' - ')
          song.songName = songName
          song.singer = singer
        } else {
          song.songName = name.replace(reg, '')
        }
        list.push(song)
      }
    })
    setAllPlayList(list)
    console.log(res)
  }

  React.useEffect(() => {
    load()
  }, [sys.path, sys.initSuccess])

  return (
    <div className="page-music-player">
      <div className="page-music-player-header">
        <div className="header-item">{`ALL (${allPlayList.length})`}</div>
        {/* <div className="header-item">{`Play List (${playList.length})`}</div> */}
      </div>
      <div className="play-list">
        <div className="play-list-header">
          <div className="song-name">歌曲</div>
          <div className="singer">演唱者</div>
          <div className="length">时长</div>
          <div className="handle"></div>
        </div>
        <div className="play-list-content">
          {allPlayList.map((item, i) => {
            const { songName, singer } = item
            return (
              <div key={i} className="song song-item">
                <div className="song-name">{songName}</div>
                <div className="singer">{singer}</div>
                <div className="length">{'03:12'}</div>
                <div className="handle">
                  <div className="play" onClick={()=>{
                    handlePlay(item)
                  }}>
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
      <div style={{ zoom: '.7' }}>
        <PlayerCard
          src="file://D:\\Music\\주영 _ HOYO-MiX - WHITE NIGHT (不眠之夜).flac"
          //
          {...props}
        />
      </div>
    </div>
  )
}

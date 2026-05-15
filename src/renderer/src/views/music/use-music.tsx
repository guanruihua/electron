import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import { useSetState } from '@/util'
import { Song } from './type'
import { SysState } from '@/type'
import { getAllSong } from './helper/getAllSong'
import { getSongEntity } from './helper/getSongEntity'
import { isNumber } from 'asura-eye'

function randomRange(min, max) {
  return Math.random() * (max - min) + min
}
export const useMusic = (sys: SysState) => {
  const [songList, setSongList] = React.useState<Song[]>([])
  const playingHistory = React.useRef<number[]>([])

  // 维护UI相关的状态
  const [state, setState] = useSetState({
    playbackMode: 'sequence',
    index: -1,
    volume: 0.1,
    favorite: false,
    song: {
      uid: '-1',
      name: 'XXX - XXX',
      // name: 'Lost in the City Lights - Sarah Johnson',
      path: '',
      // path: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const [duration, setDuration] = useState(0)
  const [seek, setSeek] = useState(0)
  // 维持播放器实例的引用
  const soundRef = useRef<Howl>(null)

  const getNextIndex = () => {
    switch (state.playbackMode) {
      // 列表循环
      case 'sequence':
        if (state.index! + 1 === songList.length) return 0
        return state.index! + 1
      // 顺序播放
      case 'repeat':
        if (state.index! + 1 === songList.length) {
          setIsPlaying(false)
          setSeek(0)
          return
        }
        return state.index! + 1
      // 单曲循环
      case 'repeat-one':
        return state.index!
      // 随机播放
      case 'shuffle':
        return randomRange(0, songList.length)
    }
  }

  const prev = () => {
    let newIndex = state.index! - 1
    if (playingHistory.current.length) {
      newIndex = playingHistory.current.at(-1)!
      playingHistory.current = playingHistory.current.slice(
        0,
        playingHistory.current.length - 1,
      )
    }
    handlePlaySong(songList.at(newIndex))
  }
  const next = () => {
    const newIndex = getNextIndex()
    if (!isNumber(newIndex)) return
    playingHistory.current.push(newIndex)
    handlePlaySong(songList.at(newIndex))
  }

  const onEnd = () => {
    console.log('song / end')
    next()
  }

  React.useEffect(() => {
    if (isEnd) {
      onEnd()
      setIsEnd(false)
    }
  }, [isEnd])

  const handlePlaySong = (item?: Song, index?: number) => {
    if (!item) return
    setState({
      song: {
        ...item,
      },
      index: isNumber(index)
        ? index
        : songList.findIndex((_) => _.path === item.path),
    })
    const { path } = item
    const src = `file://${path}`
    // 如果已有实例，先卸载旧的，以防内存泄漏
    if (soundRef.current) {
      soundRef.current.unload()
    }

    if (!src) return
    // 当音频源发生变化时，重新创建 Howl 实例
    const sound = getSongEntity({
      src,
      setIsPlaying,
      setDuration,
      setSeek,
      setIsEnd,
    })

    soundRef.current = sound
    soundRef.current.volume(state.volume)
    sound.play()
    console.log(item)
    setTimeout(() => {
      document
        .querySelector(
          '.page-music-player .play-list-content .song[data-play="true"]',
        )
        ?.scrollIntoView({
          behavior: 'smooth', // 平滑滚动（去掉就是瞬间跳）
          block: 'center', // 显示在屏幕中间
        })
    }, 1000)
  }

  // 播放
  const play = useCallback(() => {
    if (!soundRef.current) return
    soundRef.current.play()
    setIsPlaying(true)
  }, [])

  // 暂停
  const pause = useCallback(() => {
    if (!soundRef.current) return
    soundRef.current.pause()
    setIsPlaying(false)
  }, [])

  // 设置音量 (0-1)
  const setVolume = useCallback((vol) => {
    if (!soundRef.current) return
    soundRef.current.volume(vol)
    setState({ volume: vol })
  }, [])

  // 跳转到指定位移 (seconds)
  const seekTo = useCallback((pos) => {
    if (!soundRef.current) return
    soundRef.current.seek(pos)
    setSeek(pos)
  }, [])

  useEffect(() => {
    // 组件卸载时，清理 Howl 实例和定时器
    return () => {
      if (soundRef.current?._interval) {
        clearInterval(soundRef.current._interval)
      }
      if (soundRef.current) {
        soundRef.current.unload()
      }
    }
  }, []) // 依赖 src，当src改变时重新初始化整个 Howler 实例

  const load = async () => {
    if (!sys.initSuccess || !sys.path) return
    setSongList(await getAllSong())
  }

  React.useEffect(() => {
    load()
  }, [sys.path, sys.initSuccess])

  // 返回播放控制函数和UI状态
  return {
    isPlaying,
    songList,
    state,
    setState,
    prev,
    next,
    play,
    pause,
    setVolume,
    seekTo,
    duration,
    seek,
    currentTime: seek,
    handlePlaySong,
  }
}

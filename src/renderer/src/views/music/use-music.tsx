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

  // 维护UI相关的状态
  const [state, setState] = useSetState({
    playbackMode: 'sequence',
    index: 0,
    isPlaying: false,
    duration: 0,
    seek: 0,
    volume: 0.1,
    favorite: false,
    uid: '-1',
    name: 'Lost in the City Lights - Sarah Johnson',
    path: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  })
  const [duration, setDuration] = useState(0)
  const [seek, setSeek] = useState(0)
  // 维持播放器实例的引用
  const soundRef = useRef<Howl>(null)

  const onEnd = () => {
    switch (state.playbackMode) {
      // 列表循环
      case 'sequence':
        if (state.index! + 1 === songList.length) {
          return handlePlaySong(songList.at(0))
        }
        return handlePlaySong(songList.at(state.index! + 1))
      // 顺序播放
      case 'repeat':
        if (state.index! + 1 === songList.length) {
          setState({ isPlaying: false })
          setSeek(0)
          return
        }
        return handlePlaySong(songList.at(state.index! + 1))
      // 单曲循环
      case 'repeat-one':
        return handlePlaySong(songList.at(state.index!))
      // 随机播放
      case 'shuffle':
        return handlePlaySong(songList.at(randomRange(0, songList.length)))
    }
  }

  const handlePlaySong = (item?: Song, index?: number) => {
    if (!item) return
    setState({
      index: isNumber(index)
        ? index
        : songList.findIndex((_) => _.uid === item.uid),
      ...item,
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
      setState,
      setDuration,
      setSeek,
      onEnd,
    })

    soundRef.current = sound
    sound.play()
    console.log(item)
  }

  // 播放
  const play = useCallback(() => {
    if (!soundRef.current) return
    soundRef.current.play()
    setState({ isPlaying: true })
  }, [])

  // 暂停
  const pause = useCallback(() => {
    if (!soundRef.current) return
    soundRef.current.pause()
    setState({ isPlaying: false })
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
    songList,
    state,
    setState,
    prev: () => handlePlaySong(songList.at(state.index! - 1)),
    next: () => handlePlaySong(songList.at(state.index! + 1)),
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

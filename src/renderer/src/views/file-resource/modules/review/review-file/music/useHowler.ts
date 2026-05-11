import { useState, useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'

export const useHowler = (src) => {
  // 维持播放器实例的引用
  const soundRef = useRef<Howl>(null)
  // 维护UI相关的状态
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [seek, setSeek] = useState(0)

  // 播放
  const play = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.play()
      setIsPlaying(true)
    }
  }, [])

  // 暂停
  const pause = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  // 设置音量 (0-1)
  const setVolume = useCallback((vol) => {
    if (soundRef.current) {
      soundRef.current.volume(vol)
    }
  }, [])

  // 跳转到指定位移 (seconds)
  const seekTo = useCallback((pos) => {
    if (soundRef.current) {
      soundRef.current.seek(pos)
      setSeek(pos)
    }
  }, [])

  // 当音频源发生变化时，重新创建 Howl 实例
  useEffect(() => {
    // 如果已有实例，先卸载旧的，以防内存泄漏
    if (soundRef.current) {
      soundRef.current.unload()
    }

    if (!src) return

    const sound = new Howl({
      src: [src],
      html5: true, // 对于较长的音频流，建议开启
      onload: () => {
        setDuration(sound.duration())
        setVolume(0.1)
        console.log('音频加载完成，总时长:', sound.duration())
      },
      onplay: () => {
        setIsPlaying(true)
        // 设置一个定时器，每 100ms 更新一次播放进度
        const interval = setInterval(() => {
          if (sound.playing()) {
            setSeek(sound.seek())
          }
        }, 100)
        // 将定时器ID存储到实例上，以便在暂停或卸载时清除
        sound._interval = interval
      },
      onpause: () => {
        setIsPlaying(false)
        // 清除更新进度的定时器
        if (sound._interval) {
          clearInterval(sound._interval)
        }
      },
      onend: () => {
        setIsPlaying(false)
        setSeek(0)
        if (sound._interval) {
          clearInterval(sound._interval)
        }
      },
    })

    soundRef.current = sound

    // 组件卸载时，清理 Howl 实例和定时器
    return () => {
      if (sound._interval) {
        clearInterval(sound._interval)
      }
      if (soundRef.current) {
        soundRef.current.unload()
      }
    }
  }, [src]) // 依赖 src，当src改变时重新初始化整个 Howler 实例

  // 返回播放控制函数和UI状态
  return { play, pause, setVolume, seekTo, isPlaying, duration, seek }
}

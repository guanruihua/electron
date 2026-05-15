import { Howl } from 'howler'

export const getSongEntity = ({
  src,
  setIsPlaying,
  setDuration,
  setSeek,
  setIsEnd,
}) => {
  const sound = new Howl({
    src: [src],
    html5: true, // 对于较长的音频流，建议开启
    onload: () => {
      setDuration(sound.duration())
      setIsEnd(false)
      console.log('音频加载完成，总时长:', sound.duration())
    },
    onplay: () => {
      setIsPlaying(true)

      // 设置一个定时器，每 100ms 更新一次播放进度
      const interval = setInterval(() => {
        if (sound.playing()) {
          setSeek(sound.seek())
        }
      }, 500)
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
      setIsEnd(true)
      // setState({ isPlaying: false })
      // setSeek(0)
      if (sound._interval) {
        clearInterval(sound._interval)
      }
      sound.unload()
    },
  })

  return sound
}

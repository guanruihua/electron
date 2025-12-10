import React from 'react'
import { useLayout } from '@renderer/layout/use-layout'

export default function Dev() {
  const route = useLayout()
  const [images, setImages] = React.useState([])

  const handleSelectDir = async () => {
    console.log(window.electron)
    try {
      // 通过预加载脚本暴露的 API 与主进程通信
      // @ts-ignore (define in dts)
      const imageList = await window.electronAPI.selectImageDir()
      setImages(imageList)
    } catch (error) {
      console.error('Failed to load images:', error)
    }
  }

  // console.log(route)
  return (
    <div>
      Dev
    </div>
  )
}

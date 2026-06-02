import React, { useState } from 'react'
import { Slider } from 'antd'
import { CSSProperties } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

/**
 * 纯 UI 音量调节组件
 * - 滑块可拖动，仅视觉变化
 * - 静音图标可点击切换，仅图标状态变化
 * - 不涉及任何音频播放或实际音量控制
 */
export const Volume = ({ volume, setVolume }) => {
  // 仅用于 UI 状态：滑动值 0-100，静音标志
  const [uiVolume, setUiVolume] = useState(0.06)
  const [uiMuted, setUiMuted] = useState(false)
  const [showSlider, setShowSlider] = React.useState(false)
  const timer = useRef<NodeJS.Timeout | null>(null)

  // 滑块拖动时只更新 UI 数值，无任何功能副作用
  const handleVolumeChange = (value) => {
    setUiVolume(value)
    setVolume(value)
    // 如果拖动时处于静音状态，自动取消静音图标状态（可选）
    if (uiMuted) setUiMuted(false)
  }

  // 点击静音图标时只切换图标显示，并可选将滑块值置 0（为了视觉效果）
  const toggleMute = () => {
    if (!uiMuted) {
      // 模拟静音：滑块显示 0，但实际不控制任何音频
      // setUiVolume(0)
      setUiMuted(true)
      setVolume(0)
    } else {
      // 取消静音：恢复默认值 60
      // setUiVolume(0.06)
      setUiMuted(false)
      setVolume(uiVolume)
    }
  }

  // 根据 uiVolume 选择显示的图标
  const getVolumeIcon = () => {
    if (uiMuted || uiVolume === 0)
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298zM22 9l-6 6m0-6l6 6"
          ></path>
        </svg>
      )
    if (uiVolume < 40)
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298zM16 9a5 5 0 0 1 0 6"
          ></path>
        </svg>
      )

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298zM16 9a5 5 0 0 1 0 6m3.364 3.364a9 9 0 0 0 0-12.728"
        ></path>
      </svg>
    )
  }

  useEffect(() => {
    setUiVolume(volume || 0.1)
  }, [])

  return (
    <div
      className="music-volume"
      onMouseEnter={() => {
        timer.current && clearTimeout(timer.current)
        setShowSlider(true)
      }}
      onMouseLeave={() => {
        timer.current && clearTimeout(timer.current)
        timer.current = setTimeout(() => {
          setShowSlider(false)
          timer.current && clearTimeout(timer.current)
        }, 1000)
      }}
    >
      <div
        className="music-volume-control"
        onClick={toggleMute}
        title={uiMuted ? '取消静音' : '静音'}
      >
        {getVolumeIcon()}
        <span className="music-volume-control-value">
          {Math.floor(uiVolume * 100)}%
        </span>
      </div>

      {/* {showSlider && ( */}
      <Slider
        className="music-volume-slider"
        min={0}
        max={1}
        step={0.01}
        value={uiVolume}
        onChange={handleVolumeChange}
        style={
          {
            width: 150,
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
        tooltip={{
          formatter: (value) =>
            value !== undefined ? `${Math.floor(value * 100)}%` : '音量',
        }}
      />
      {/* )} */}
    </div>
  )
}

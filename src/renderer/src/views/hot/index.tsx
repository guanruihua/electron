import { Button, Tabs } from 'antd'
import { Icon } from '@/components'
import { isArray, isString } from 'asura-eye'
import { useWebViewStore } from './store'
import { items, Conf } from './conf'
import './index.less'
import './info-card.less'
import React from 'react'

export default function Hot() {
  const wv = useWebViewStore()
  const [updateTime, setUpdateTime] = React.useState(-1)
  const timer = React.useRef<NodeJS.Timeout | null>(null)

  const reload = async () => {
    if (!isArray(items)) return
    const [key, _, url] = Conf.find((_) => _[0] === wv.activeUID) || []
    if (!isString(key)) return
    wv.set({ activeUID: key })
    try {
      if (key && url) await wv.analysisURL(key, url, true)
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    wv.init()
  }, [])

  const reloadAll = async () => {
    Conf.forEach(async (item) => {
      const [key, _, url] = item
      if (!isString(key)) return
      try {
        if (key && url) await wv.analysisURL(key, url, false)
      } catch (error) {
        console.error(error)
      }
    })
  }

  React.useEffect(() => {
    updateTime && reloadAll()
  }, [updateTime])

  React.useEffect(() => {
    timer.current = setInterval(() => {
      setUpdateTime(Date.now())
    }, 600000)

    return () => {
      timer.current && clearInterval(timer.current)
    }
  }, [])

  const updateDate = wv?.Data?.[wv?.activeUID || '']?.updateDate || ''

  return (
    <div className="page__hot">
      <Tabs
        tabBarExtraContent={{
          right: (
            <div className="flex row gap">
              {updateDate && <div className="update-date">{updateDate}</div>}
              <Button
                loading={wv?.loadings?.[wv.activeUID || ''] || false}
                icon={<Icon type="reload" />}
                onClick={reload}
              />
            </div>
          ),
        }}
        activeKey={wv.activeUID}
        items={items}
        onChange={(activeUID) => wv.set({ activeUID })}
      />
    </div>
  )
}

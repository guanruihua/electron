import { Button, Tabs } from 'antd'
import { Icon } from '@/components'
import { isArray, isString } from 'asura-eye'
import { useHotStore } from './store'
import { items, Conf } from './conf'
import './index.less'
import './info-card.less'
import React from 'react'

export default function Hot() {
  const wv = useHotStore()

  const reload = async () => {
    if (!isArray(items)) return
    const [key, _, url] = Conf.find((_) => _[0] === wv.activeUID) || []
    if (!isString(key)) return
    wv.set({ activeUID: key })
    try {
      if (key && url) await wv.analysisURL(key, url)
    } catch (error) {
      console.error(error)
    }
  }
  React.useEffect(() => {
    wv.init()
  }, [])

  const updateDate = wv?.Data?.[wv?.activeUID || '']?.updateDate || ''

  return (
    <div className="page__hot">
      <Tabs
        tabBarExtraContent={{
          right: (
            <div className="flex row gap">
              {updateDate && <div className='update-date'>{updateDate}</div>}
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

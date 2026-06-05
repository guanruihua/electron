import React from 'react'
import { useSysStore } from '@/store/sys'
import Opt from './modules/opt'
import './index.less'
import { User } from './modules/user'
import { Email } from './modules/email'

export default function Setting() {
  const sys = useSysStore()

  React.useEffect(() => {
    sys.set({ initSuccess: false })
    sys.init(true)
  }, [])

  const load = async () => {
    const { path } = sys

    const list = ['db', 'clipboard-db', 'weather-db']
    for (let val of list) {
      const res = await window.api.db({
        action: 'init',
        DBName: val,
        payload: {
          path,
        },
      })

      if (res.data) {
        console.log(`[Success] Init DB: "${val}"`)
      } else {
        console.log(`[Error] Init DB: "${val}"`)
      }
    }
  }

  React.useEffect(() => {
    if (sys.initSuccess && sys.path) {
      load()
    }
  }, [sys.initSuccess, sys.path])

  return (
    <div className="page__setting layout-grid">
      <User />
      <Opt />
      <Email />
    </div>
  )
}

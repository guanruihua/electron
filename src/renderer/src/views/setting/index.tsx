import React from 'react'
import { useSysStore } from '@/store/sys'
import Opt from './modules/opt'
import './index.less'
import { User } from './modules/user'
import { Email } from './modules/email'
import { ContentLayout } from '@/components/layout'
import { SysSetting } from './modules/sys-setting'

export default function Setting() {
  const sys = useSysStore()

  React.useEffect(() => {
    sys.set({ initSuccess: false })
    sys.init(true)
  }, [])

  return (
    <ContentLayout name="setting" className="page__setting layout-grid">
      <SysSetting />
      <User />
      <Opt />
      <Email />
    </ContentLayout>
  )
}

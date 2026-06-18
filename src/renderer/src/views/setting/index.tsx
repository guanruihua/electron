import Opt from './modules/opt'
import './index.less'
import { User } from './modules/user'
import { Email } from './modules/email'
import { ContentLayout } from '@/components/layout'
import { SysSetting } from './modules/sys-setting'

export default function Setting() {
  return (
    <ContentLayout name="setting" className="page__setting layout-grid">
      <SysSetting />
      <User />
      <Opt />
      <Email />
    </ContentLayout>
  )
}

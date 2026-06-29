import Opt from './modules/opt'
import { User } from './modules/user'
import { Email } from './modules/email'
import { ContentLayout } from '@/components/layout'
import { SysSetting } from './modules/sys-setting'
import './index.less'
import LoginPlatform from './modules/login-platform/login-platform'

export default function Setting() {
  return (
    <ContentLayout name="setting" className="page__setting layout-grid">
      <SysSetting />
      <LoginPlatform />
      <User />
      <Opt />
      <Email />
    </ContentLayout>
  )
}

import { Icon } from '@/components'
import { Button } from 'antd'
import './login-platform.less'
import { Switch } from 'antd'
import { useSysStore } from '@/store/sys'
import React from 'react'
import { useWebViewStore } from '@/views/hot/store'
import { invoke, sleep } from '@/util'
import { isString } from 'asura-eye'

const Conf = [
  //
  ['jenkins', 'jenkins', 'https://jenkins.yessafe.com.cn'],
  ['zhihu', '知乎', 'https://www.zhihu.com/hot', 'signin'],
]

const isLogin = (url: string) => {
  if (!isString(url)) return false
  return ['signin', 'login'].some((_) => url.includes(_))
}

export default function LoginPlatform() {
  const wv = useWebViewStore()
  const { Logged = {} } = wv
  const sys = useSysStore()
  const { enableLoginPlatform = false } = sys?.userInfo?.setting || {}

  const init = async () => {
    const Logged = wv.Logged || {}

    const check = async (uid: string) => {
      const pageUrl = await invoke('webView', { uid, type: 'get-url' })
      if (isLogin(pageUrl)) {
        Logged[uid] = true
        return true
      }
      Logged[uid] = false
      return false
    }

    Promise.all(
      Conf.map(async (item) => {
        const [uid, _, url] = item
        await invoke('webView', { url, uid })
        const status = await check(uid)
        if (status) return
        await sleep(2000)
        const status2 = await check(uid)
        if (status2) return
        await sleep(2000)
        const status3 = await check(uid)
        if (status3) return
        await sleep(2000)
        await check(uid)
      }),
    )
  }

  React.useEffect(() => {
    init()
  }, [])

  console.log(wv.Logged)

  return (
    <div className="login-platform layout-module">
      <div className="login-platform-header w-layout-flex justify-start mb">
        <Switch
          checked={enableLoginPlatform}
          checkedChildren={'Enabled Login Platform'}
          unCheckedChildren={'Disabled Login Platform'}
          onChange={(enableLoginPlatform) => {
            sys.setUserInfo(
              {
                enableLoginPlatform,
              },
              'setting',
            )
          }}
        />
        <Button icon={<Icon type="reload" />} />
      </div>
      <div className="login-platform-container">
        {Conf.map((item) => {
          const [uid, name, url] = item
          const loggedStatus = !!Logged[uid]
          return (
            <div
              className="login-platform-item layout-flex"
              key={url}
              data-logged={loggedStatus}
            >
              {loggedStatus ? <Icon type="check" /> : <Icon type="close" />}
              <div className="name">{name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

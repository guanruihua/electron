import { Icon, StatusButton } from '@/components'
import { Button } from 'antd'
import './login-platform.less'
import { Switch } from 'antd'
import { useSysStore } from '@/store/sys'
import { useWebViewStore } from '@/views/hot/store'
import { invoke } from '@/util'
import { isString } from 'asura-eye'
import React from 'react'

const Conf = [
  //
  ['jenkins', 'jenkins', 'https://jenkins.yessafe.com.cn'],
  ['zhihu', '知乎', 'https://www.zhihu.com', 'signin'],
]

const isLogin = (url: string) => {
  if (!isString(url)) return false
  return !['signin', 'login'].some((_) => url.includes(_))
}

export default function LoginPlatform() {
  const wv = useWebViewStore()
  const { Status = {} } = wv
  const sys = useSysStore()
  const { enableLoginPlatform = false } = sys?.userInfo?.setting || {}

  const handleInit = async (uid: string, url: string) => {
    const res = await invoke('webView', { uid, url })
    wv.setStatus({
      [`${uid}_init`]: !!res,
    })
  }

  const handleLogin = async (uid: string, showLoginPage = true) => {
    const url = await invoke('webView', {
      uid,
      type: 'get-url',
    })
    const status = !!isLogin(url)
    wv.setStatus({
      [`${uid}_login`]: status,
    })
    if (!status && showLoginPage) {
      wv.set({ tmpActiveUID: uid })
      await invoke('webView', { uid, type: 'show' })
    }
  }

  const init = async () => {
    const flag = sys?.userInfo?.setting?.enableLoginPlatform
    if (!flag) return

    return Promise.all(
      Conf.map(async (item) => {
        const [uid, _, url] = item
        await handleInit(uid, url)
        await handleLogin(uid, false)
      }),
    )
  }

  React.useEffect(() => {
    sys.initSuccess && init()
  }, [sys.initSuccess])

  return (
    <div className="login-platform layout-module">
      {wv.tmpActiveUID && (
        <div className="root-badge">
          <Button
            icon={<Icon type="close" />}
            onClick={async () => {
              await invoke('webView', { uid: wv.tmpActiveUID, type: 'hidden' })
            }}
          />
        </div>
      )}
      <div className="login-platform-header w-layout-flex justify-start mb">
        <Switch
          checked={enableLoginPlatform}
          checkedChildren={'Enabled Login Platform'}
          unCheckedChildren={'Disabled Login Platform'}
          onChange={(enableLoginPlatform) =>
            sys.setUserInfo({ enableLoginPlatform }, 'setting')
          }
        />
        <Button
          icon={<Icon type="reload" />}
          onClick={() => {
            init()
          }}
        />
      </div>
      <div className="login-platform-container">
        {Conf.map((item) => {
          const [uid, name, url] = item
          return (
            <div
              className="login-platform-item w-layout-flex space-between"
              key={url}
            >
              <div className="name">{name}</div>
              <div className="right">
                <StatusButton
                  label="Init"
                  type="link"
                  status={Status[`${uid}_init`]}
                  onClick={() => handleInit(uid, url)}
                />
                <StatusButton
                  type="link"
                  status={Status[`${uid}_login`]}
                  label="Login"
                  onClick={() => handleLogin(uid)}
                />
                <Button
                  type="link"
                  icon={<Icon type="window" />}
                  onClick={async () => {
                    wv.set({ tmpActiveUID: uid })
                    await invoke('webView', { uid, type: 'show' })
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import React from 'react'
import { Button } from 'antd'
import { req } from '@/util'
import { Icon } from '@/components'

export function Email() {
  const [running, setRunning] = React.useState(false)
  const check = async () => {
    try {
      const res: any = await req('get', '/check')
      if (res?.data?.data) {
        setRunning(true)
      }
      console.log(res)
    } catch (error) {
      console.error(error)
      setRunning(false)
    }
  }

  React.useEffect(() => {
    check()
  }, [])

  const sendTextEmail = async () => {
    const res = await req('post', '/email/post', {
      type: 'text',
    })
    console.log(res)
  }
  const sendAuthCodeEmail = async () => {
    const res = await req('post', '/email/post', {
      type: 'authCode',
      target: {
        authCode: '9981aaa',
      },
    })
    console.log(res)
  }
  const sendHTMLEmail = async () => {
    const res = req('post', '/email/post', {
      type: 'html',
    })
    console.log(res)
  }
  return (
    <div className="layout-module card" data-running={running}>
      <div className="flex gap col">
        <div className="title">
          <Icon type="check" />
          <Icon type="close" />
          Backend Server
        </div>
        <div className="flex gap">
          <Button onClick={check}>Check</Button>
        </div>
        <div className="flex gap col">
          <div className="title">Email</div>
          <div className="flex gap row">
            <Button disabled={!running} onClick={sendTextEmail}>
              Send Text
            </Button>
            <Button disabled={!running} onClick={sendAuthCodeEmail}>
              Send Auth Code
            </Button>
            <Button disabled={!running} onClick={sendHTMLEmail}>
              Send HTMl
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

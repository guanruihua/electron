// import { Pages } from '@/layout/routes'
// import { useNavigate } from 'react-router-dom'
import './index.less'
// import React from 'react'

export function Home() {
  // const nav = useNavigate()
  // const [msg, setMsg] = React.useState('')

  return (
    <div className="page__home">
      {/* {msg} */}
      <button
        onClick={async () => {
          // setMsg(JSON.stringify(val, null, 2))
        }}
      >
        test
      </button>
      <button
        onClick={() => {
          window.api.openPath('https://www.google.com')
          // window.electronAPI.openPath(`C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`)
        }}
      >
        open
      </button>
      <div className="page__home-page-container">
        {/* {Pages.map((item: any) => {
          return (
            <div
              key={item.path}
              className="page__home-page-container-page-item"
              onClick={() => nav(item.path)}
            >
              {item.name}
            </div>
          )
        })} */}
      </div>
      {/* <div>{JSON.stringify(location, null, 2)}</div> */}
    </div>
  )
}

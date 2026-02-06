import { Button } from 'antd'

export function Opt({ handle }) {
  return (
    <div className="root-layout-home-view-opt">
      <div className="flex gap">
        <Button className="bolder" onClick={() => window.api.openMaskWindow()}>
          打开遮罩
        </Button>
        <Button className="bolder" onClick={handle.openDevtool}>
          Devtool
        </Button>
        <Button className="bolder" onClick={handle.reload}>
          Reload
        </Button>
        {/* Google Sans Code, monospace; */}
        <Button
          className="bolder"
          onClick={async () => {
            const res  = await window.api.invoke('cmd', 'tasklist | findstr node')
            console.log(res)
          }}
        >
          Find ALL Node Thread
        </Button>
        <Button
          className="bolder"
          onClick={async () => {
            const res  = await window.api.invoke('cmd', 'taskkill /F /IM node.exe')
            console.log(res)
          }}
        >
          Stop ALL Node Thread
        </Button>
      </div>
    </div>
  )
}

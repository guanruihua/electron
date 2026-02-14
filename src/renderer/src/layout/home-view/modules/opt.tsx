import { Button } from 'antd'
import { ModuleProps } from '../../type'

export function Opt(props: ModuleProps) {
  const { handle } = props.h
  return (
    <div className="root-layout-home-view-opt flex col justify-center overflow-y module-bg">
      <h4 className="mb">OPT</h4>
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
      </div>
    </div>
  )
}

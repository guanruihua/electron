import { Icon } from './icon'
import { Handle, State } from '../type'
import Conf from './conf'

interface Props {
  state: State
  handle: Handle
  [key: string]: any
}

export function VSCodeOpt(props: Props) {
  const { handle } = props

  return (
    <div className="root-layout-home-view-vscode-opt flex gap p col justify-center">
      {/* <Button onClick={async () => {}}>Test</Button> */}
      <div className="flex gap flex-wrap">
        {Conf.items.map((item, i) => (
          <div
            key={i}
            className="opt-item flex col border border-radius box-shadow px pb"
            data-path={item.path.replaceAll('\\', '>')}
            data-start
            data-pid
            style={{ width: 240 }}
          >
            <span
              className="bolder text-10 pointer"
              onClick={() => window.api.invoke('cmd', `code ${item.path}`)}
            >
              {item.label || item.path}
            </span>
            <span className="flex items-center">
              <Icon
                type="vscode"
                className="opt open"
                onClick={() => {
                  handle.addTimePoint(item)
                  window.api.invoke('cmd', `code ${item.path}`)
                }}
              />

              {item?.web && (
                <>
                  <Icon
                    type="web"
                    className="opt web"
                    onClick={() => handle?.addTab({ url: item.web })}
                  />
                  <Icon
                    type="google"
                    className="opt google"
                    onClick={() =>
                      window.api.invoke('cmd', `start chrome ${item.web}`)
                    }
                  />
                </>
              )}
              <Icon
                type="dir"
                className="opt dir"
                onClick={
                  () => window.api.invoke('cmd', `explorer "${item.path}"`)
                }
              />
              <Icon
                type="run"
                className="opt run"
                data-disabled={!item.npm}
                onClick={() => handle?.NodeThread?.dev?.(item)}
              />
              <Icon
                type="stop"
                className="opt stop"
                onClick={() => handle.NodeThread.stopItem(item)}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

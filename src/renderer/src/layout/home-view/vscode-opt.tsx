import { Icon } from './icon'
import { Handle, State } from '../type'

interface Props {
  state: State
  handle: Handle
  [key: string]: any
}

export function VSCodeOpt(props: Props) {
  const { handle } = props
  const items = [
    {
      label: 'workspace',
      path: 'D:\\dev\\workspace',
    },
    {
      label: 'AppPulse·Web',
      path: 'D:\\work\\work_space\\Apppluse\\AppPulse_Web2',
      npm: 'dev',
    },
    {
      label: 'AppScoutBoss·Web',
      path: 'D:\\work\\work_space\\AppScoutBoss\\appscoutboss_web',
      npm: 'dev',
    },
    {
      label: 'AppScoutDRPS·Web',
      path: 'D:\\work\\work_space\\AppScoutDRPS_Web',
      npm: 'dev',
    },
    {
      label: 'app-ai-plugin',
      path: 'D:\\dev\\workspace\\ai\\app-ai-plugin',
      npm: 'start',
    },
    {
      label: 'auard',
      path: 'D:\\dev\\workspace\\ui\\aurad',
      npm: 'start',
    },
    {
      label: 'electron',
      path: 'D:\\dev\\workspace\\docs\\electron',
      npm: 'start',
    },
    {
      label: 'guanruihua.github.io',
      path: 'D:\\dev\\workspace\\docs\\guanruihua.github.io',
    },
    {
      label: 'guanruihua.github.io·web-v2',
      path: 'D:\\dev\\workspace\\docs\\guanruihua.github.io\\web-v2',
      npm: 'start',
    },
    {
      label: 'appshield Portal·Web',
      path: 'D:\\work\\work_space\\appshieldportal_web',
      npm: 'dev',
    },
  ]
  return (
    <div className="root-layout-home-view-vscode-opt flex gap col justify-center">
      <div className="bold text-center">VSCode Operation</div>
      <div
        className="grid gap flex-wrap"
        style={{
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="opt-item flex border border-radius box-shadow items-center pr space-between"
          >
            <span
              className="bolder text-10 pointer px"
              onClick={() => window.api.invoke('cmd', `code ${item.path}`)}
            >
              {item.label || item.path}
            </span>
            <span className='flex'>
              <Icon
                type="open"
                className="opt open"
                onClick={() => window.api.invoke('cmd', `code ${item.path}`)}
              />
              <Icon
                type="run"
                className="opt run"
                data-disabled={!item.npm}
                onClick={() => handle?.NodeThread?.dev?.(item)}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

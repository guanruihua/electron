import { useLayoutStore } from '@/store/layout'
import './sys-setting.less'

export function SysSetting() {
  const ly = useLayoutStore()
  const col = ly.innerCol || 1

  return (
    <div className="sys-setting layout-module">
      <div className="switch-screen-size-box">
        {[1, 2, 3].map((v) => (
          <div
            key={v}
            className="switch-screen-size"
            data-select={col === v}
            onClick={() => {
              window.api.invoke('setSize', { width: 500 * v + 10 })
              if (ly.innerCol !== v) ly.set({ innerCol: v })
            }}
          >
            <div
              className="logo"
              style={{
                gridTemplateColumns: new Array(v).fill('1fr').join(' '),
              }}
            >
              {new Array(v).fill('').map((_, i) => (
                <div key={v + '_' + i} className="switch-screen-size-render" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

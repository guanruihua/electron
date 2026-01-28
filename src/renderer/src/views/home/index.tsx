import { usePageState } from './state'
import { Header } from './components/header'
import { View } from './view'
import './index.less'
import { Button } from 'antd'

export function Home() {
  const { info, state, setState, handle } = usePageState()

  return (
    <div className="main-layout">
      <Header state={state} setState={setState} handle={handle} />
      <div className="page__home">
        {state?.tabs?.map((id) => (
          <View
            key={id}
            id={id}
            info={info}
            state={state}
            setState={setState}
            handle={handle}
          />
        ))}
      </div>
      <div
        className="page__iframe-tool-bar"
        style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          display: 'flex',
          gap: 10,
        }}
      >
        <Button onClick={handle.openDevtool}>
          <span style={{ color: '#000' }}>Devtool</span>
        </Button>
        <Button onClick={handle.reload}>
          <span style={{ color: '#000' }}>Reload</span>
        </Button>
      </div>
    </div>
  )
}

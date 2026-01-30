import { ConfigProvider, theme } from 'antd'
import { usePageState } from './state'
import { Header } from './components/header'
import { View } from './view'
import './style/root.less'
import './style/index.less'
import './style/header.less'
import './style/root-view.less'
import './style/other.less'

export default function Layout() {
  const { info, state, handle } = usePageState()

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div className="root-layout">
        <Header state={state} handle={handle} />
        <div className="root-view">
          {state?.tabs?.map((id) => (
            <View key={id} id={id} info={info} state={state} handle={handle} />
          ))}
        </div>
      </div>
    </ConfigProvider>
  )
}

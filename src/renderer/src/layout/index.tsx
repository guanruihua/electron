import { ConfigProvider, theme } from 'antd'
import { usePageState } from './state'
import { Header } from './components/header'
import { View } from './view'
import './style/root.less'
import './style/index.less'
import './style/header.less'
import './style/root-view.less'
import './style/data.less'
import './style/util/index.less'

export default function Layout() {
  const h = usePageState()

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div className="root-layout">
        <Header {...h} />
        <div className="root-view-container">
          {h.tabs?.map((tab) => (
            <View key={tab.id} tab={tab} h={h} />
          ))}
        </div>
      </div>
    </ConfigProvider>
  )
}

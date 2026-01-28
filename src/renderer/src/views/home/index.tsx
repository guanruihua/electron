// import { Pages } from '@/layout/routes'
import './index.less'

import { usePageState } from './state'
import { Header } from './components/header'
import { View } from './view'

export function Home() {
  const { state, setState, handle } = usePageState()

  return (
    <div className="main-layout">
      <Header state={state} setState={setState} handle={handle} />
      <div className="page__home">
        <View state={state} setState={setState} handle={handle} />
      </div>
    </div>
  )
}

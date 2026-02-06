import React from 'react'
import './index.less'
import { Opt } from './opt'
import { VSCodeOpt } from './vscode-opt'
import { Handle, State } from '../type'

export interface HomeViewProps {
  state: State
  handle: Handle
  [key: string]: any
}

export function HomeView(props: HomeViewProps) {
  const { state, handle } = props

  React.useEffect(() => {}, [])

  return (
    <div className="root-layout-home-view flex justify-center items-center col gap">
      <span
        className="bold"
        style={{
          fontSize: 24,
        }}
      >
        Home
      </span>
      <Opt state={state} handle={handle} />
      <VSCodeOpt state={state} handle={handle} />
    </div>
  )
}

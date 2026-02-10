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

  return (
    <div className="root-layout-home-view flex justify-center items-center col gap h w">
      <div
        className="grid h w gap"
        style={{
          gridTemplateColumns: '1fr',
          gap: 10,
        }}
      >
        <Opt state={state} handle={handle} />
        <VSCodeOpt state={state} handle={handle} />
      </div>
    </div>
  )
}

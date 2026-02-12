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
    <div className="root-layout-home-view flex justify-center items-center col gap h w overflow-y max-h">
      <div className="h w p">
        <VSCodeOpt state={state} handle={handle} />
        <Opt state={state} handle={handle} />
      </div>
      <br />
    </div>
  )
}

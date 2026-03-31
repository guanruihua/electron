import React from 'react'
import { ObjectType } from '0type'
import { Icon } from '@/components'
import { ModuleProps } from '@/type'
import { isString } from 'asura-eye'
import { useLoadings, Loadings } from '@/util'

export const Module = (props: ModuleProps & { item: ObjectType }) => {
  const { h, item } = props
  const { handle } = h
  const viewLoadings: Loadings = h.loadings || {}
  const [loadings = {}, setLoadings] = useLoadings({
    run: false,
    stop: false,
  })

  if (isString(item?.type) && item.type.toLowerCase() === 'group')
    return (
      <React.Fragment>
        <div
          className="grid-span-full"
          style={{
            borderBottom: '2px solid rgba(255,255,255, .2)',
            marginBottom: 10,
          }}
        />
        <div className="grid-span-full">
          <div className="bold text-12 pointer border-bottom">
            {item.label || item.path}
          </div>
          <div
            className="grid-layout grid"
            style={{
              marginTop: 5,
            }}
          >
            {item.children?.map?.((item, i) => (
              <Module key={i} item={item} h={props.h} />
            ))}
          </div>
        </div>
      </React.Fragment>
    )

  return (
    <div
      className="opt-item flex"
      data-path={item.path.replaceAll('\\', '>')}
      data-start
      data-pid
      title={item.label || item.path}
    >
      <span className="opt-item-name bold">{item.label || item.path}</span>
      <span className="opt-item-btns flex items-center">
        <Icon
          loading={loadings.run || viewLoadings.stopAll || viewLoadings.findAll}
          type="run"
          className="opt run"
          data-disabled={!item.npm}
          onClick={() =>
            setLoadings(handle?.NodeThread?.dev?.(item, true), 'run')
          }
        />
        <Icon
          loading={
            loadings.stop || viewLoadings.stopAll || viewLoadings.findAll
          }
          type="stop"
          className="opt stop alway-show"
          onClick={() =>
            setLoadings(handle.NodeThread.stopModule(item, true), 'stop')
          }
        />
        {item?.web && (
          <>
            {/* <Icon
              loading={loadings.addTab}
              type="web"
              className="opt web"
              onClick={() =>
                setLoadings(handle?.addTab({ url: item.web }), 'addTab')
              }
            /> */}
            <Icon
              loading={loadings.google}
              type="google"
              className="opt google"
              onClick={() =>
                setLoadings(
                  window.api.invoke('cmd', `start chrome ${item.web}`),
                  'google',
                )
              }
            />
          </>
        )}
        <Icon
          loading={loadings.vscode}
          type="vscode"
          className="opt open"
          onClick={() => {
            setLoadings(window.api.invoke('cmd', `code ${item.path}`), 'vscode')
          }}
        />
        <Icon
          loading={loadings.dir}
          type="dir"
          className="opt dir"
          onClick={() =>
            setLoadings(
              window.api.invoke('cmd', `explorer "${item.path}"`),
              'dir',
            )
          }
        />
        <Icon
          loading={loadings.git}
          type="git"
          className="opt git"
          onClick={() => setLoadings(handle.git(item), 'git')}
        />
      </span>
    </div>
  )
}

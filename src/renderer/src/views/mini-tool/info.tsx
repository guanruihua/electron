import { ObjectType } from '0type'
import React from 'react'

export interface InfoProps {
  [key: string]: any
}

export function Info(props: InfoProps) {
  const {} = props
  const recentlyUsedList = new Array(30).fill({
    icon: '',
    name: '名称',
    path: '',
  })
  const [startMenus, setStartMenu] = React.useState<ObjectType[]>([])
  const init = async () => {
    const val: ObjectType[] = await window.api.getStartMenu()
    console.log('🚀 ~ Home ~ val:', val)
    setStartMenu(val)
  }
  React.useEffect(() => {
    init()
  }, [])

  // console.log(startMenus)

  return (
    <div className="page__miniTool-container-info">
      <h4>最近使用</h4>
      <div className="app-list">
        {startMenus.map((item, i) => {
          const name = item.target
            .split(/\\/)
            .at(-1)
            ?.replace(/\.lnk$/, '')
          return (
            <div key={i} className="app-card" title={item.description}>
              <div className="logo">
                {item.iconDataURL ? (
                  <img src={item.iconDataURL} />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#DADCE0"
                      d="M13 9V3.5L18.5 9M6 2c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                    ></path>
                  </svg>
                )}
              </div>
              <div className="name">{name}</div>
            </div>
          )
        })}
        {/* {recentlyUsedList.map((item, i) => {
          return (
            <div key={i} className="app-card">
              <div className="logo">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#DADCE0"
                    d="M13 9V3.5L18.5 9M6 2c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                  ></path>
                </svg>
              </div>
              <div className="name">{item.name}</div>
            </div>
          )
        })} */}
      </div>
    </div>
  )
}

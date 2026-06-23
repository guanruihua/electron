import { useSysStore } from '@/store/sys'
import { isString } from 'asura-eye'
import React from 'react'

export interface ImgProps extends React.HtmlHTMLAttributes<HTMLImageElement> {
  [key: string]: any
}

export function Img(props: ImgProps) {
  const { path } = useSysStore()
  const { src, ...rest } = props
  const [renderSrc, setRenderSrc] = React.useState('')

  const init = async () => {
    if (!isString(src)) return
    const res_query = await window.api.db({
      action: 'find',
      tableName: 'img',
      DBName: 'img',
      payload: {
        src,
      },
    })
    const localPath = res_query?.data?.at(0)?.path

    if (localPath) {
      setRenderSrc('file://' + localPath)
      return
    }
    setRenderSrc(src)

    const filename = src.split('/').at(-1)
    const newPath = `${path}\\db\\image\\img\\${filename}`
    const flag = await window.api.fs('saveUrlImg2File', {
      url: src,
      path: newPath,
      cover: true,
    })
    if (flag) {
      const res = await window.api.db({
        action: 'update',
        tableName: 'img',
        DBName: 'img',
        payload: {
          src,
          path: newPath,
        },
      })
      if (!res?.error) setRenderSrc('file://' + newPath)
    }
  }
  React.useEffect(() => {
    init()
  }, [src])

  return (
    <img
      src={renderSrc}
      onError={() => {
        if (renderSrc !== src) setRenderSrc(src)
      }}
      {...rest}
    />
  )
}

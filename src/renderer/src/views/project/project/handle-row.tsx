import { Button, Space } from 'antd'
import { isArray, isObject } from 'asura-eye'
import React from 'react'

interface RowProps {
  row: any[]
  [key: string]: any
}

export function HandleRow(props: RowProps) {
  const { row } = props
  if (!isArray(row)) return <React.Fragment />
  return (
    <Space.Compact style={{ justifyContent: 'flex-start' }} block>
      {row.map((item, j) => {
        if (!isObject(item)) return <React.Fragment key={j} />
        const { label, ...rest }: any = item
        return (
          <Button key={j} {...rest}>
            {label}
          </Button>
        )
      })}
    </Space.Compact>
  )
}

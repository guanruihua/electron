import { Button, ButtonProps } from 'antd'
import { Icon } from '../icons'
import React from 'react'
import './index.less'
import { classNames } from 'harpe'

type Props = {
  status?: boolean
  label?: React.ReactNode
  children?: React.ReactNode
} & ButtonProps

export function StatusButton(props: Props) {
  const { status = '', className, label, children, ...rest } = props

  return (
    <Button
      className={classNames('status-button', className)}
      data-cmp-status={status}
      icon={status ? <Icon type="check" /> : <Icon type="close" />}
      {...rest}
    >
      {label}
      {children}
    </Button>
  )
}

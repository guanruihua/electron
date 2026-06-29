import { Icon } from '@/components'
import { likeValue } from '@/util'
import { AutoComplete, AutoCompleteProps } from 'antd'
import { Button } from 'antd'
import { useState } from 'react'

export interface ProjectHeaderProps {
  [key: string]: any
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const { sys, task } = props
  const { loadings } = task

  const getOptions = () =>
    sys?.modules?.map((_) => {
      const { label, path } = _
      return {
        value: label || path,
      }
    }) || []

  const [options, setOptions] =
    useState<AutoCompleteProps['options']>(getOptions())

  const onSearch = (searchText: string) => {
    setOptions(getOptions().filter((_) => likeValue(searchText, _, 'value')))
  }

  return (
    <div className="project-header">
      <div className="project-header-container">
        <div className="project-header-query-input">
          <AutoComplete
            options={options}
            allowClear
            showSearch={{
              onSearch,
            }}
            placeholder="Search..."
            onChange={(value) => {
              sys.setUserInfo(
                {
                  filterModule: value,
                },
                'setting',
              )
            }}
          />
        </div>
      </div>

      <div className="root-badge">
        <Button
          className="edit-json-file"
          icon={<Icon type="edit" />}
          loading={loadings.project}
          onClick={() =>
            task.run({
              uid: 'project__edit-json-file',
              name: 'Edit Project JSON File',
              async exec() {
                return await window.api.invoke(
                  'cmd',
                  `code ${sys.path}\\modules.json`,
                )
              },
            })
          }
        />
        <Button
          className="reload"
          loading={loadings.nodeThread}
          icon={<Icon type="reload" style={{ fontSize: 16 }} />}
          onClick={() =>
            task.run({
              uid: 'nodeThread__query',
              name: 'Query Node Thread',
              exec: sys.findNodeTreads,
            })
          }
        />
      </div>
    </div>
  )
}

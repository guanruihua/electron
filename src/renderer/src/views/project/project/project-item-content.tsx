import { ProjectConf } from '@/type'
import { Button } from 'antd'
import { Icon } from '@/components'
import { isArray } from 'asura-eye'
import './project-item-content.less'
import { useProjectOpt } from './hook'

export const ProjectItemContent = (props: { item: ProjectConf }) => {
  const { item } = props
  const { test, projName, loadings, FSStatus, run, runGroup, stop, execTask } =
    useProjectOpt({ item })
  const { running, pid } = item
  const webs = Object.keys(item).filter((key) => key.startsWith('url-'))

  return (
    <div className="project-item-content" data-start={running}>
      {isArray(pid) && pid.length > 0 && (
        <div className="pids">
          <div>PIDs:</div>
          {pid.map((p) => (
            <div key={p}>{p}</div>
          ))}
        </div>
      )}
      <div className="flex row gap wrap">
        <Button
          loading={
            loadings.projectOptRunGroup || loadings.projectOptDependencies
          }
          className="run-group run"
          disabled={FSStatus.node_modules === false}
          data-hidden={!item.npm || running}
          style={{ width: '100%' }}
          onClick={runGroup}
        >
          <div className="run-group-box">
            <Icon type="run" />
            <span>Run</span>
            {item['url-review'] && (
              <>
                <Icon type="google" />
                Review
              </>
            )}
            <Icon type="vscode" />
            VS Code
          </div>
        </Button>

        <Button
          loading={
            loadings.projectOpt__run || loadings.projectOptDependencies
          }
          className="run"
          data-hidden={!item.npm || running}
          disabled={FSStatus.node_modules === false}
          icon={<Icon type="run" />}
          onClick={run}
        >
          Run
        </Button>

        <Button
          loading={
            loadings.projectOpt__stop || loadings.projectOptDependencies
          }
          className="stop"
          data-hidden={!item.npm || !running}
          icon={<Icon type="stop" />}
          onClick={stop}
        >
          Stop
        </Button>

        <Button
          loading={loadings.projectOpt__VSCode}
          icon={<Icon type="vscode" />}
          onClick={() => execTask('VSCode')}
        >
          VS Code
        </Button>
        <Button
          loading={loadings.projectOpt__Cmd}
          icon={<Icon type="cmd" />}
          onClick={() => execTask('Cmd')}
        >
          Cmd
        </Button>
        <Button
          loading={loadings.projectOpt__FRM}
          icon={<Icon type="dir" />}
          onClick={() => execTask('FRM')}
        >
          FRM
        </Button>

        <div
          className="project-item-content-module"
          data-hidden={!webs.length}
          data-type="dependencies"
        >
          <div className="project-item-content-module-name">Web</div>
          <div className="project-item-content-module-child">
            {webs.map((key) => {
              const value = item[key]
              const tmp = key.replace('url-', '')
              const label = tmp.slice(0, 1).toUpperCase() + tmp.slice(1)
              return (
                <Button
                  key={key}
                  icon={<Icon type="google" />}
                  className="text-10"
                  data-key={key}
                  loading={loadings[`projectOpt__Web-${value}`]}
                  onClick={() =>
                    value &&
                    execTask(
                      'Web',
                      value,
                      `Open the ${projName} Project in ${label} Web`,
                    )
                  }
                >
                  {label}
                </Button>
              )
            })}
          </div>
        </div>

        <div
          className="project-item-content-module"
          // data-hidden={FSStatus['package.json'] === false}
          data-type="dependencies"
        >
          <div className="project-item-content-module-name">Dependencies</div>
          <div className="project-item-content-module-child">
            <Button
              data-type={'install'}
              // disabled={FSStatus.node_modules === true}
              // loading={loadings.projectOptDependencies}
              icon={<Icon type={'install'} />}
              className="project-item-content-module-child-item"
              onClick={() => execTask('install')}
            >
              Install
            </Button>
            <Button
              data-type={'reinstall'}
              // disabled={FSStatus.node_modules === false}
              // loading={loadings.projectOptDependencies}
              icon={<Icon type={'install'} />}
              className="project-item-content-module-child-item"
              onClick={() => execTask('reinstall')}
            >
              Reinstall
            </Button>
            <Button
              data-type={'uninstall'}
              // disabled={FSStatus.node_modules === false}
              // loading={loadings.projectOptDependencies}
              icon={<Icon type={'install'} />}
              className="project-item-content-module-child-item"
              onClick={() => execTask('uninstall')}
            >
              Uninstall
            </Button>
          </div>
        </div>
        {/* <Button onClick={test}>Test</Button> */}
      </div>
    </div>
  )
}

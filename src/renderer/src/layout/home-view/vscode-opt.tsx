export function VSCodeOpt() {
  const items = [
    {
      label: 'workspace',
      path: 'D:\\dev\\workspace',
    },
    {
      label: 'AppPulse·Web',
      path: 'D:\\work\\work_space\\Apppluse\\AppPulse_Web2',
      npm: 'dev',
    },
    {
      label: 'AppScoutBoss·Web',
      path: 'D:\\work\\work_space\\AppScoutBoss\\appscoutboss_web',
      npm: 'dev',
    },
    {
      label: 'AppScoutDRPS·Web',
      path: 'D:\\work\\work_space\\AppScoutDRPS_Web',
      npm: 'dev',
    },
    {
      label: 'app-ai-plugin',
      path: 'D:\\dev\\workspace\\ai\\app-ai-plugin',
      npm: 'start',
    },
    {
      label: 'auard',
      path: 'D:\\dev\\workspace\\ui\\aurad',
      npm: 'start',
    },
    {
      label: 'electron',
      path: 'D:\\dev\\workspace\\docs\\electron',
      npm: 'start',
    },
    {
      label: 'guanruihua.github.io',
      path: 'D:\\dev\\workspace\\docs\\guanruihua.github.io',
    },
    {
      label: 'guanruihua.github.io·web-v2',
      path: 'D:\\dev\\workspace\\docs\\guanruihua.github.io\\web-v2',
      npm: 'start',
    },
    {
      label: 'appshield Portal·Web',
      path: 'D:\\work\\work_space\\appshieldportal_web',
      npm: 'dev',
    },
  ]
  return (
    <div className="root-layout-home-view-vscode-opt flex gap col justify-center">
      <div className="bold text-center">VSCode Operation</div>
      <div className="flex gap flex-wrap justify-center">
        {items.map((item, i) => (
          <div
            key={i}
            className="opt-item flex flex-wrap border border-radius box-shadow items-center pr"
          >
            <span
              className="bolder text-10 pointer px"
              onClick={() => window.api.invoke('cmd', `code ${item.path}`)}
            >
              {item.label || item.path}
            </span>
            <svg
              className="opt"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              onClick={() => window.api.invoke('cmd', `code ${item.path}`)}
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4m-8-2l8-8m0 0v5m0-5h-5"
              ></path>
            </svg>
            <svg
              className="opt"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              data-disabled={!item.npm}
              onClick={() =>
                // item.npm && window.api.invoke('cmd', 'cmd.exe D://')
                window.api.invoke('dev', [
                  `cd ${item.path}`,
                  `npm.cmd run ${item.npm}`,
                ].join(' && '))
              }
            >
              <path
                fill="currentColor"
                d="M4.506 3.503L12.501 8l-8 4.5zm-.004-1.505C3.718 1.998 3 2.626 3 3.5v9c0 .874.718 1.502 1.502 1.502c.245 0 .496-.061.733-.195l8-4.5c1.019-.573 1.019-2.041 0-2.615l-8-4.499a1.5 1.5 0 0 0-.733-.195"
              ></path>
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Frontend = [
  [
    'dependencies',
    [
      [
        'install',
        'install',
        async (item) => window.api.invoke('cmd', `cd ${item.path} && cnpm i`),
      ],
      [
        'reinstall',
        'reinstall',
        async (item) =>
          window.api.invoke('cmd', `cd ${item.path} && rimraf node_modules && cnpm i`),
      ],
      [
        'uninstall',
        'del',
        async (item) =>
          window.api.invoke(
            'cmd',
            `cd ${item.path} && rimraf node_modules`,
          ),
      ],
    ],
  ],
]

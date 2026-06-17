import DashboardView from '@/views/dashboard'
// import FileResourceManagement from '@/views/file-resource'
import Setting from '@/views/setting'
import { ClipboardManager } from '@/views/clipboard'
import MusicPlayer from '@/views/music/music'
import Project from '@/views/project/project'
import App from '@/views/app/app'
// import TerminalPage from '@/views/terminal'
// import { View } from '@/views/view'

export const Routes = [
  {
    id: '01',
    title: 'Dashboard',
    type: 'dashboard',
    children: <DashboardView />,
    // destroyOnHidden: false,
  },
  // { id: '02',
  //   title: 'File Resource',
  // type: 'fsm', children: <FileResourceManagement /> },
  {
    id: '02',
    title: 'Project',
    type: 'project',
    children: <Project />,
  },
  { id: '03', title: 'App', type: 'app', children: <App /> },
  {
    id: '04',
    title: 'Clipboard',
    type: 'clipboard',
    children: <ClipboardManager />,
    destroyOnHidden: false,
  },
  {
    id: '05',
    type: 'music-player',
    children: <MusicPlayer />,
    destroyOnHidden: false,
  },
  {
    id: '100',
    title: 'Setting',
    type: 'setting',
    children: <Setting />,
    destroyOnHidden: false,
  },
  // { type: 'terminal',
  //   title: 'Terminal',
  // children: <TerminalPage /> },
  // { type: 'agent',
  //   title: 'Agent',

  // children: <View /> },
]

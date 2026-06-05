import DashboardView from '@/views/dashboard'
// import FileResourceManagement from '@/views/file-resource'
import TaskResourceManager from '@/views/task-resource'
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
    type: 'dashboard',
    children: <DashboardView />,
    destroyOnHidden: false,
  },
  // { id: '02', type: 'fsm', children: <FileResourceManagement /> },
  { id: '02', type: 'project', children: <Project /> },
  { id: '03', type: 'app', children: <App /> },
  { id: '200', type: 'trm', children: <TaskResourceManager /> },
  {
    id: '04',
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
  { id: '100', type: 'setting', children: <Setting />, destroyOnHidden: false },
  // { type: 'terminal', children: <TerminalPage /> },
  // { type: 'agent', children: <View /> },
]
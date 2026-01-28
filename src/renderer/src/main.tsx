import { createRoot } from 'react-dom/client'
// import { RouterProvider, createHashRouter } from 'react-router-dom'
import './layout/index.less'
import 'aurad/dist/style.css'
import { Home } from './views/home'

const root = createRoot(document.querySelector('.root')!)
function App() {
  return <Home/>
  // return <RouterProvider router={createHashRouter(routes)} />

}
root.render(<App />)

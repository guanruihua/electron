import { createRoot } from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { routes } from './layout/routes'

const root = createRoot(document.querySelector('.root')!)
function App() {
  return <RouterProvider router={createHashRouter(routes)} />
}
root.render(<App />)

import { createRoot } from 'react-dom/client'
import 'aurad/dist/style.css'
import Layout from './layout'

const root = createRoot(document.querySelector('.root')!)

root.render(<Layout />)

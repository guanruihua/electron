// import { RouteObject } from 'react-router-dom'
// import { Layout } from '.'
// import { Home } from '@/views/home'
// import { WebViewPage } from '@/views/webview'
// import { StartMenu } from '@/views/startMenu'
// import { MiniTool } from '@/views/mini-tool'

// export const Pages: (RouteObject & {
//   name: string
// })[] = [
//   {
//     name: 'Web View',
//     path: '/webView',
//     element: <WebViewPage />,
//   },
//   {
//     name: 'Start Menu',
//     path: '/startMenu',
//     element: <StartMenu />,
//   },
//   {
//     name: 'MiniTool',
//     path: '/mini-tool',
//     element: <MiniTool />,
//   },
// ]

// const getRoutes = () => {
//   const routes: RouteObject[] = [
//     {
//       path: '/',
//       element: <Layout />,
//       children: [
//         {
//           index: true,
//           element: <Home />,
//         },
//         {
//           path: '/',
//           element: <Home />,
//         },
//         {
//           path: '/home',
//           element: <Home />,
//         },
//       ],
//     },
//   ]
//   Pages.map((item) => {
//     const { path, element } = item
//     if (routes[0].children)
//       routes[0].children.push({
//         path,
//         element,
//       })
//   })
//   return routes
// }

// export const routes = getRoutes()

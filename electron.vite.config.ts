import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
        // react: '/node_modules/react',
        // 'react-dom': '/node_modules/react-dom',
        // '@renderer': resolve(__dirname, 'src/renderer/src')
      },
    },
    plugins: [react()],
    // build: {
    //   rollupOptions: {
    //     // input 配置多个入口文件，key 是输出文件名，value 是源文件路径
    //     input: {
    //       // 主窗口入口（默认）
    //       index: resolve('src/renderer/index.html'),
    //       // 第二个窗口入口（自定义名称，比如 secondary）
    //       secondary: resolve('src/renderer/fullscreen.html'),
    //       // 如需更多入口，继续添加即可
    //       // third: resolveRendererPath('third.html')
    //     },
    //   },
    //   // 可选：指定输出目录结构（保持和单入口一致即可）
    //   outDir: 'dist/renderer',
    //   assetsDir: 'assets',
    // },
    server: {
      port: 3302,
    },
  },
})

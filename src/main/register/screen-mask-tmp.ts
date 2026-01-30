export const ScreenMaskTmp = `<!doctype html>
<html class="night night-theme">
  <head>
    <meta charset="UTF-8" />
    <title>Ruihuag</title>
  </head>
  <style>
    body {
      overflow: hidden;
      min-width: 100vw;
      min-height: 100vh;
      background-color: rgba(0, 0, 0, 0.8);
      padding: 0;
      margin: 0;
    }

    .root {
      min-width: 100vw;
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 34px;
    }

    .root .bottom {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: 1fr;
    }
    .mask {
      height: calc(100vh - 34px);
      width: 100vw;
      -webkit-app-region: drag;
    }
    .controls {
      padding: 0 10px;
    }
    .controls button {
      border: none;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.5);
      font-weight: bold;
      font-size: 16px;
      min-width: 24px;
      height: 24px;
      transition: all 0.3s;
    }

    .controls button:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  </style>

  <body>
    <div class="root">
      <div class="mask"></div>
      <div class="bottom">
        <div></div>
        <div class="controls">
         
          <button onclick="changeOpacity(0.1)">+</button>
          <button onclick="changeOpacity(-0.1)">-</button>
        </div>
      </div>
    </div>
  </body>
  <script>
    // 初始透明度
    let currentOpacity = 0.8
 // <button onclick="changeZoom(0.1)">zoom +</button>
          // <button onclick="changeZoom(-0.1)">zoom -</button>
    // 更新背景透明度
    function updateBackground() {
      document.body.style.backgroundColor = "rgba(0, 0, 0, "+ currentOpacity + "})"
    }

    // 改变透明度
    function changeOpacity(delta) {
      currentOpacity += delta
      // 限制在 0 到 1 之间
      if (currentOpacity < 0) currentOpacity = 0
      if (currentOpacity > 1) currentOpacity = 1
      updateBackground()
    }

    // 键盘快捷键支持
    document.addEventListener('keydown', (e) => {
      if (e.key === '+' || e.key === '=') {
        changeOpacity(0.1)
      } else if (e.key === '-' || e.key === '_') {
        changeOpacity(-0.1)
      } else if (e.key === '0') {
        // 按 0 重置
        currentOpacity = 0.2
        updateBackground()
      }
    })

    function changeZoom(zoom) {
      console.log('🚀 ~ changeZoom ~ zoom:', zoom, window)
      // window.api.resizeMaskWindow(zoom)
      window.api.test(zoom)
    }
    // window.addEventListener(
    //   'wheel',
    //   (e) => {
    //     // 阻止页面默认滚动行为（可选，避免页面滚动干扰）
    //     e.preventDefault()

    //     // 判断滚动方向：deltaY > 0 向下（缩小），deltaY < 0 向上（放大）
    //     const direction = e.deltaY > 0 ? 'down' : 'up'

    //     // 调用主进程的缩放方法
    //     window.api.resizeMaskWindow(direction)

    //     // 实时更新窗口尺寸显示（可选）
    //     // 注：渲染进程无法直接获取窗口尺寸，这里简化为估算，也可通过 IPC 从主进程获取
    //     const [currentW, currentH] = document
    //       .getElementById('sizeInfo')
    //       .textContent.match(/\d+/g)
    //     const step = 10
    //     const newW =
    //       direction === 'up' ? Number(currentW) + step : Number(currentW) - step
    //     const newH =
    //       direction === 'up' ? Number(currentH) + step : Number(currentH) - step
    //     // document.getElementById('sizeInfo').textContent =
    //   },
    //   { passive: false },
    // ) // passive: false 才能调用 preventDefault()
  </script>
</html>`

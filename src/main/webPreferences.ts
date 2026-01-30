import { BrowserWindowConstructorOptions } from 'electron'

// webPreferences WebPreferences （可选）—— 网页功能设置
const webPreferences: BrowserWindowConstructorOptions['webPreferences'] = {
  // devTools boolean (可选) - 是否开启 DevTools. 如果设置为 false, 则无法使用 BrowserWindow.webContents.openDevTools () 打开 DevTools。 默认值为 true。
  // nodeIntegration boolean (可选) - 是否启用Node integration. 默认值为 false.
  // nodeIntegration: false,
  // nodeIntegrationInWorker boolean (可选) - 是否在Web工作器中启用了Node集成. 默认值为 false. More about this can be found in Multithreading.
  // nodeIntegrationInSubFrames boolean (可选项)(实验性)，是否允许在子页面(iframe)或子窗口(child window)中集成Node.js； 预先加载的脚本会被注入到每一个iframe，你可以用 process.isMainFrame 来判断当前是否处于主框架（main frame）中。
  // preload string (可选) -在页面运行其他脚本之前预先加载指定的脚本 无论页面是否集成Node, 此脚本都可以访问所有Node API 脚本路径为文件的绝对路径。 当 node integration 关闭时, 预加载的脚本将从全局范围重新引入node的全局引用标志 See example here.
  // sandbox boolean (可选)-如果设置该参数, 沙箱的渲染器将与窗口关联, 使它与Chromium OS-level 的沙箱兼容, 并禁用 Node. js 引擎。 它与 nodeIntegration 的选项不同，且预加载脚本的 API 也有限制. Default is true since Electron 20. The sandbox will automatically be disabled when nodeIntegration is set to true. Read more about the option here.
  // session Session (optional) - Sets the session used by the page. 而不是直接忽略 Session 对象, 也可用 partition 选项来代替，它接受一个 partition 字符串. 同时设置了session 和 partition时, session 的优先级更高. 默认使用默认的 session.
  // partition string (optional) - 通过 session 的 partition 字符串来设置界面session. 如果 partition 以 persist:开头, 该页面将使用持续的 session，并在所有页面生效，且使用同一个partition. 如果没有 persist: 前缀, 页面将使用 in-memory session. 通过分配相同的 partition, 多个页可以共享同一会话。 默认使用默认的 session.
  // zoomFactor number (可选) - 页面的默认缩放系数, 3.0 表示 300%。 默认值为 1.0.
  // javascript boolean (可选) - 是否启用 JavaScript 支持。 默认值为 true。
  // webSecurity boolean (可选) - 当设置为 false, 它将禁用同源策略 (通常用来测试网站), 如果此选项不是由开发者设置的，还会把 allowRunningInsecureContent设置为 true. 默认值为 true。
  // allowRunningInsecureContent boolean (可选) - 允许一个 https 页面运行来自http url的JavaScript, CSS 或 plugins。 默认值为 false.
  // images boolean (可选) - 允许加载图片。 默认值为 true。
  // imageAnimationPolicy string (可选) - 指定如何运行图像动画 (比如： GIF等). 可以是 animate, animateOnce 或 noAnimation. 默认值为 animate.
  // textAreasAreResizable boolean (可选) - 允许调整 TextArea 元素大小。 默认值为 true。
  // webgl boolean (可选) - 启用 WebGL 支持。 默认值为 true。
  // plugins boolean (可选) - 是否应该启用插件。 默认值为 false.
  // experimentalFeatures boolean (可选) - 启用 Chromium 的实验功能。 默认值为 false.
  // scrollBounce boolean (可选) macOS - 启用滚动回弹（橡皮筋）效果。 默认值为 false.
  // enableBlinkFeaturesstring(可选) - 以逗号分隔的需要启用的特性列表，譬如CSSVariables,KeyboardEventKey 在 RuntimeEnabledFeatures.json5文件中查看被支持的所有特性.
  // disableBlinkFeatures string (可选) - 以 ,分隔的禁用特性列表, 如 CSSVariables,KeyboardEventKey. 在RuntimeEnabledFeatures.json5 文件中查看被支持的所有特性.
  // defaultFontFamily Object (可选) - 为font-family设置默认字体。
  // standard string (可选) - 默认值为 Times New Roman.
  // serif string (可选) - 默认值为 Times New Roman.
  // sansSerif string (可选) - 默认值为 Arial.
  // monospace string (可选) - 默认值为 Courier New.
  // cursive string (可选) - 默认值为 Script.
  // fantasy string (可选) - 默认值为 Impact.
  // math string (可选) - 默认值为 Latin Modern Math.
  // defaultFontSize Integer (可选) - 默认值为 16.
  // defaultMonospaceFontSize Integer (可选) - 默认值为 13.
  // minimumFontSize Integer (可选) - 默认值为 0.
  // defaultEncoding string (可选) - 默认值为 ISO-8859-1.
  // backgroundThrottlingboolean (可选)-是否在页面成为背景时限制动画和计时器。 This also affects the Page Visibility API. When at least one webContents displayed in a single browserWindow has disabled backgroundThrottling then frames will be drawn and swapped for the whole window and other webContents displayed by it. 默认值为 true。
  // offscreen Object | boolean (optional) - Whether to enable offscreen rendering for the browser window. 默认值为 false. See the offscreen rendering tutorial for more details.
  // useSharedTexture boolean (optional) Experimental - Whether to use GPU shared texture for accelerated paint event. 默认值为 false. See the offscreen rendering tutorial for more details.
  // sharedTexturePixelFormat string (optional) Experimental - The requested output format of the shared texture. 默认值为：argb。 The name is originated from Chromium media::VideoPixelFormat enum suffix and only subset of them are supported. The actual output pixel format and color space of the texture should refer to OffscreenSharedTexture object in the paint event.
  // argb - The requested output texture format is 8-bit unorm RGBA, with SRGB SDR color space.
  // rgbaf16 - The requested output texture format is 16-bit float RGBA, with scRGB HDR color space.
  // contextIsolation boolean (可选) - 是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本. 默认为 true。 预加载脚本所运行的上下文环境只能访问其自身专用的文档和全局窗口，其自身一系列内置的JavaScript (Array, Object, JSON, 等等) 也是如此，这些对于已加载的内容都是不可见的。 Electron API 将只在预加载脚本中可用，在已加载页面中不可用。 这个选项应被用于加载可能不被信任的远程内容时来确保加载的内容无法篡改预加载脚本和任何正在使用的Electron api。 该选项使用的是与Chrome内容脚本相同的技术。 你可以在开发者工具Console选项卡内顶部组合框中选择 'Electron Isolated Context'条目来访问这个上下文。
  // webviewTag boolean (optional) - Whether to enable the <webview> tag. 默认值为 false. ** 注意: **为 < webview> 配置的 preload 脚本在执行时将启用节点集成, 因此应确保远程或不受信任的内容无法创建恶意的 preload 脚本 。 You can use the will-attach-webview event on webContents to strip away the preload script and to validate or alter the <webview>'s initial settings.
  // additionalArguments string[] (可选) - 一个将被附加到当前应用程序的渲染器进程中process.argv的字符串列表 。 可用于将少量的数据传递到渲染器进程预加载脚本中。
  // safeDialogs boolean (可选) - 是否启用浏览器样式的持续对话框保护。 默认值为 false.
  // safeDialogsMessage string (可选) - 当持续对话框保护被触发时显示的消息。 如果没有定义，那么将使用缺省的消息。注意：当前缺省消息是英文，并没有本地化。
  // disableDialogs boolean (可选) - 是否完全禁用对话框。 覆盖 safeDialogs。 默认值为 false.
  // navigateOnDragDrop boolean (可选) - 将文件或链接拖放到页面上时是否触发页面跳转。 默认值为 false.
  // autoplayPolicy string (可选) - 窗口中内容要使用的自动播放策略，值可以是 no-user-gesture-required, user-gesture-required, document-user-activation-required。 默认为 no-user-gesture-required。
  // disableHtmlFullscreenWindowResize boolean (可选) - 是否阻止窗口在进入 HTML 全屏时调整大小。 默认值为 false.
  // accessibleTitle string (可选) - 仅提供给如屏幕读取器等辅助工具的替代标题字符串。 此字符串不直接对用户可见。
  // spellcheck boolean (可选) - 是否启用内置拼写检查器。 默认值为 true。
  // enableWebSQL boolean (可选) - 是否启用 WebSQL api。 默认值为 true。
  // v8CacheOptions string (可选) - 强制 blink 使用 v8 代码缓存策略。 可接受的值为：
  // none - 禁用代码缓存
  // code - 基于启发式代码缓存
  // bypassHeatCheck - 绕过启发式代码缓存，但使用懒编译。
  // bypassHeatCheckAndEagerCompile - 与上面相同，除了编译是及时的。 默认策略是 code。
  // enablePreferredSizeMode boolean (可选) - 是否启用首选大小模式。 首选大小是包含文档布局所需的最小大小--无需滚动。 启用该属性将导致在首选大小发生变化时，在WebContents 上触发 preferred-size-changed 事件。 默认值为 false.
  // transparent boolean (optional) - Whether to enable background transparency for the guest page. 默认值为 true。 Note: The guest page's text and background colors are derived from the color scheme of its root element. When transparency is enabled, the text color will still change accordingly but the background will remain transparent.
  // enableDeprecatedPaste boolean (optional) Deprecated - Whether to enable the paste execCommand. 默认值为 false.
  // paintWhenInitiallyHiddenboolean(可选) - 当show为false并且渲染器刚刚被创建时，它是否应激活。 为了让document.visibilityState 在show: false的情况下第一次加载时正确地工作，你应该把这个设置成false. 设置为 false 将会导致ready-to-show 事件不触发。 默认值为 true。
}

export default webPreferences

<https://uapis.cn/pricing>
<https://sessionhu.github.io/bilibili-API-collect/docs/live/info.html#%E8%8E%B7%E5%8F%96%E6%88%BF%E9%97%B4%E9%A1%B5%E5%88%9D%E5%A7%8B%E5%8C%96%E4%BF%A1%E6%81%AF>
<https://sessionhu.github.io/bilibili-API-collect/docs/live/info.html#%E8%8E%B7%E5%8F%96%E4%B8%BB%E6%92%AD%E4%BF%A1%E6%81%AF>

```js
// 该代码适用于 Node.js 环境，运行时需要安装 axios 库：npm install axios
const axios = require('axios')

// 调用B站官方API接口
const url = 'https://api.live.bilibili.com/room/v1/Room/room_init'
const params = { id: 123456 } // 这里换成你想要检测的主播的房间号 (room_id)

axios
  .get(url, { params })
  .then((response) => {
    const data = response.data
    if (data.code === 0) {
      const live_status = data.data.live_status
      if (live_status === 1) {
        console.log('主播正在直播中！')
      } else {
        console.log('主播当前未开播。')
      }
    } else {
      console.log('获取状态失败，请稍后重试。')
    }
  })
  .catch((error) => {
    console.error('请求出错:', error)
  })
```

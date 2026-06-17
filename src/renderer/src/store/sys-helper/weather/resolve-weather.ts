import { req } from '@/util'
import { summarizeWeather } from './summarizeWeather'

// ---------- 使用示例 ----------
// 假设你已经将上述 JSON 赋值给变量 weatherJson
// const weatherData = { ... };  // 你提供的 JSON 对象
// const result = summarizeWeather(weatherData);
// console.log(result.join('\n'));

// 输出示例:
// 2026-06-05: 少云，气温 29.41℃ / 19.19℃
// 2026-06-06: 晴，气温 26.85℃ / 17.76℃
// 2026-06-07: 少云，气温 27.83℃ / 19.5℃

// https://platform.caiyunapp.com/api/manage
// https://platform.caiyunapp.com/application/manage
export const resolveWeather = async (): Promise<string[]> => {
  const res = await req(
    'get',
    'https://api.caiyunapp.com/v2.6/j8KFHg2u7asmu9hT/113.579,22.269/daily?dailysteps=3',
  )
  const { status, data } = res || {}
  if (status === 'success' && data.status !== 'ok') {
    const weatherInfo = summarizeWeather(data)
   
    return weatherInfo
  }

  return []
}

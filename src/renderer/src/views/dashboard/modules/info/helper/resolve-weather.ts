import { req } from '@/util'
import dayjs from 'dayjs'

/**
 * 解析天气数据，提取每日温度和天空状况总结
 * @param {Object} weatherData - 符合心知天气 API 返回格式的 JSON 对象
 * @returns {Array<string>} 每日天气总结字符串数组
 */
function summarizeWeather(weatherData) {
  // 获取每日数据
  const daily = weatherData?.result?.daily
  if (!daily) {
    return ['数据无效：缺少 daily 字段']
  }

  const temperatures = daily.temperature
  const skycons = daily.skycon

  if (!temperatures || !skycons || temperatures.length !== skycons.length) {
    return ['数据不完整：温度或天气状况数据缺失']
  }

  // 天空状况映射 (根据心知天气 API 的常见值)
  const skyconMap = {
    CLEAR_DAY: '晴',
    CLEAR_NIGHT: '晴',
    PARTLY_CLOUDY_DAY: '少云',
    PARTLY_CLOUDY_NIGHT: '少云',
    CLOUDY: '多云',
    LIGHT_RAIN: '小雨',
    MODERATE_RAIN: '中雨',
    HEAVY_RAIN: '大雨',
    OVERCAST: '阴',
    // 可继续添加其他类型
  }

  const summaries: string[] = []

  const days = ['今天', '明天', '后天']

  for (let i = 0; i < temperatures.length; i++) {
    const temp = temperatures[i]
    const sky = skycons[i]
    // 提取日期 (YYYY-MM-DD)
    // const date = temp.date.split('T')[0]
    // const date = dayjs(temp.date.split('T')[0]).format('M/D')
    const maxTemp = temp.max
    const minTemp = temp.min
    const skyValue = sky.value
    const skyText = skyconMap[skyValue] || skyValue // 若无映射则显示原值

    const summary = `${days[i]} ${minTemp}℃ - ${maxTemp}℃ ${skyText}`
    summaries.push(summary)
  }

  return summaries
}

// ---------- 使用示例 ----------
// 假设你已经将上述 JSON 赋值给变量 weatherJson
// const weatherData = { ... };  // 你提供的 JSON 对象
// const result = summarizeWeather(weatherData);
// console.log(result.join('\n'));

// 输出示例:
// 2026-06-05: 少云，气温 29.41℃ / 19.19℃
// 2026-06-06: 晴，气温 26.85℃ / 17.76℃
// 2026-06-07: 少云，气温 27.83℃ / 19.5℃
import { tableName, DBName } from '@/views/dashboard/conf'

// https://platform.caiyunapp.com/api/manage
// https://platform.caiyunapp.com/application/manage
export const resolveWeather = async () => {
  const date = dayjs().format('YYYY-MM-DD')

  const query = await window.api.db({
    action: 'find',
    tableName,
    DBName,
    payload: {
      uid: 'ruihuag',
      date,
    },
  })
  console.log(query)
  if (!query.error && query.data?.at(0)?.weatherInfo) {
    return query.data.at(0).weatherInfo
  }
  const res = await req(
    'get',
    'https://api.caiyunapp.com/v2.6/j8KFHg2u7asmu9hT/113.579,22.269/daily?dailysteps=3',
  )
  if (res.status !== 'ok') return []

  const data = summarizeWeather(res)
  await window.api.db({
    action: 'update',
    tableName,
    DBName,
    payload: {
      uid: 'ruihuag',
      date,
      weatherInfo: data,
    },
  })
  console.log('resolveWeather', data)
  return data
}

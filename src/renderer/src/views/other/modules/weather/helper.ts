import { ObjectType } from '0type'
import { Weather } from '@/type'
import dayjs from 'dayjs'

const WEATHER_CODE_MAP = {
  0: '晴',
  1: '基本晴朗',
  2: '局部多云',
  3: '阴天',
  45: '雾',
  48: '雾凇',
  51: '毛毛雨 (轻度)',
  53: '毛毛雨 (中度)',
  55: '毛毛雨 (浓密)',
  56: '冻毛毛雨 (轻度)',
  57: '冻毛毛雨 (浓密)',
  61: '小雨',
  63: '中雨',
  65: '大雨',
  66: '冻雨 (轻度)',
  67: '冻雨 (重度)',
  71: '小雪',
  73: '中雪',
  75: '大雪',
  77: '雪粒',
  80: '小雨',
  81: '中雨',
  82: '大雨',
  85: '小雪',
  86: '大雪',
  95: '雷暴',
  96: '雷暴伴冰雹 (轻度)',
  99: '雷暴伴冰雹 (重度)',
}

// 香洲区坐标
const latitude = 22.27
const longitude = 113.54

// 构建请求URL
const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Shanghai&forecast_days=15&past_days=1`

const now = dayjs()
const str0 = now.add(-1, 'day').format('YYYY-MM-DD')
const str1 = now.format('YYYY-MM-DD')
const str2 = now.add(1, 'day').format('YYYY-MM-DD')
const map = { 0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六' }

const getTimeName = (time: string) => {
  if (time === str0) return '昨天'
  if (time === str1) return '今天'
  if (time === str2) return '明天'
  const t = dayjs(time, 'YYYY-MM-DD').weekday()
  return '周' + map[t]
}
type WeatherRes = { list: Weather[]; count: ObjectType<number> }
// 处理并显示天气数据的函数
function displayWeather(data: any): WeatherRes {
  // console.log(data)
  const daily = data.daily
  const dates = daily.time
  const maxTemps = daily.temperature_2m_max
  const minTemps = daily.temperature_2m_min
  const precipitations = daily.precipitation_sum
  const weather_codes = daily.weather_code
  const list: Weather[] = []

  const count = {
    min: 9999,
    max: -1,
  }

  // 循环打印每一天的数据
  for (let i = 0; i < dates.length; i++) {
    const min = minTemps[i]
    const max = maxTemps[i]
    const code = weather_codes[i]
    if (min < count.min) count.min = min
    if (max > count.max) count.max = max

    list.push({
      timeName: getTimeName(dates[i]),
      weather: WEATHER_CODE_MAP[code] || '未知天气',
      date: dates[i],
      code,
      min,
      max,
      mm: precipitations[i],
    })
  }
  // console.log(count)

  return { list, count }
}
const cache = {}
export async function getWeather(): Promise<WeatherRes | undefined> {
  const key = dayjs().format()

  return new Promise((rs) => {
    if (cache[key]) {
      rs(cache[key])
      return
    }
    // 发起API请求
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        // 成功获取数据后，调用处理函数
        const res = displayWeather(data)
        cache[key] = res
        rs(res)
      })
      .catch((error) => {
        console.error('获取天气数据失败:', error)
        rs(undefined)
      })
  })
}

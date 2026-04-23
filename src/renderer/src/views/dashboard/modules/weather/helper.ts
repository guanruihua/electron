import { Weather } from '@/type'

const WEATHER_CODE_MAP = {
    0: "晴",
    1: "基本晴朗",
    2: "局部多云",
    3: "阴天",
    45: "雾",
    48: "雾凇",
    51: "毛毛雨 (轻度)",
    53: "毛毛雨 (中度)",
    55: "毛毛雨 (浓密)",
    56: "冻毛毛雨 (轻度)",
    57: "冻毛毛雨 (浓密)",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    66: "冻雨 (轻度)",
    67: "冻雨 (重度)",
    71: "小雪",
    73: "中雪",
    75: "大雪",
    77: "雪粒",
    80: "小雨",
    81: "中雨",
    82: "大雨",
    85: "小雪",
    86: "大雪",
    95: "雷暴",
    96: "雷暴伴冰雹 (轻度)",
    99: "雷暴伴冰雹 (重度)"
};

// 香洲区坐标
const latitude = 22.27
const longitude = 113.54

// 构建请求URL
const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Shanghai&forecast_days=15&past_days=1`

// 处理并显示天气数据的函数
function displayWeather(data:any): Weather[] {
  // console.log(data)
  const daily = data.daily
  const dates = daily.time
  const maxTemps = daily.temperature_2m_max
  const minTemps = daily.temperature_2m_min
  const precipitations = daily.precipitation_sum
  const weather_codes = daily.weather_code
  const list: any[] = [
    // '日期\t\t最高温(℃)\t最低温(℃)\t总降雨量(mm)',
    // '------------------------------------------------',
  ]
/**
0 多云
0.1 - 9.9	小雨
10.0 - 24.9	中雨
25.0 - 49.9	大雨
50.0 - 99.9	暴雨
100.0 - 249.9	大暴雨
≥ 250.0	特大暴雨
 */

  // 循环打印每一天的数据
  for (let i = 0; i < dates.length; i++) {
    list.push({
      weather: WEATHER_CODE_MAP[weather_codes[i]] || "未知天气",
      date: dates[i],
      min: minTemps[i],
      max: maxTemps[i],
      mm: precipitations[i],
    })
  }
  return list
}

export async function getWeather(): Promise<Weather[] | undefined> {
  return new Promise((rs) => {
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
        rs(displayWeather(data))
      })
      .catch((error) => {
        console.error('获取天气数据失败:', error)
        rs(undefined)
      })
  })
}

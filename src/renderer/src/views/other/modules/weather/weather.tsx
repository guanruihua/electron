import React from 'react'
import { getWeather } from './helper'
import { Weather } from '@/type'
import './weather.less'
import { ObjectType } from '0type'
import { Chart } from 'aurad'
import { WeatherIcon } from './icons'

export interface WeatherProps {
  [key: string]: any
}

export default function WeatherModule(props: WeatherProps) {
  const {} = props
  const [weather, setWeather] = React.useState<Weather[]>([])
  const [count, setCount] = React.useState<ObjectType<number>>({})

  const init = async () => {
    const { list = [], count = {} } = (await getWeather()) || {}
    setWeather(list || [])
    setCount(count)
  }
  React.useEffect(() => {
    init()
  }, [])

  const options = {
    tooltip: {
      trigger: 'axis',
      textStyle: {
        fontSize: 10,
      },
    },
    grid: {
      left: '30px',
      right: '60px',
      top: '20px',
      bottom: '20px',
      containLabel: true,
    },

    xAxis: {
      show: false,
      type: 'category',
      boundaryGap: false,
      data: weather.map((_) => _.date),
    },
    yAxis: {
      show: false,
      boundaryGap: false,
      type: 'value',
      min: count.min || 0,
    },
    series: [
      {
        name: '最高温度',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: 'rgb(252, 198, 83)',
        },
        itemStyle: {
          color: 'rgb(252, 198, 83)',
        },
        label: {
          show: true,
          formatter: '{c}°',
          color: '#fff',
          fontSize: 8,
        },
        data: weather.map((_) => _.max),
      },
      {
        name: '最低温度',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: 'rgb(252, 198, 83)',
        },
        itemStyle: {
          color: 'rgb(252, 198, 83)',
        },
        label: {
          show: true,
          position: 'bottom',
          formatter: '{c}°',
          color: '#fff',
          fontSize: 8,
        },
        data: weather.map((_) => _.min),
      },
    ],
  }

  return (
    <div className="weather-module">
      <div className="weather-box">
        {weather.map((w: Weather) => {
          const { date, timeName, weather, code } = w
          console.log(w)
          return (
            <div key={date} className="weather-item">
              <div className="time-name">{timeName}</div>
              <div className="date">
                {date
                  .replace(/\d\d\d\d-/, '')
                  .replace('-', '/')
                  .replace(/^0/, '')}
              </div>
              <div className="weather-icon">
                <WeatherIcon code={code} />
              </div>
              <div className="weather">{weather}</div>
            </div>
          )
        })}
        <Chart
          className="weather-chart"
          options={options}
          key={JSON.stringify(options)}
        />
      </div>
    </div>
  )
}

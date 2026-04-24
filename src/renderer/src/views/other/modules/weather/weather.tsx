import React from 'react'
import { getWeather } from './helper'
import { Weather } from '@/type'
import { ObjectType } from '0type'
import { Chart } from 'aurad'
import { WeatherIcon } from './icons'
import './weather.less'
import { toOptions } from './toOptions'
import { DiagonalLoading } from '@/components'

export default function WeatherModule() {
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

  const options = toOptions(weather, count)

  return (
    <div className="weather-module">
      {weather.length ? (
        <div className="weather-box">
          {weather.map((w: Weather) => {
            const { date, timeName, weather, code } = w
            // console.log(w)
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
      ) : (
        <DiagonalLoading style={{ height: 300 }} />
      )}
    </div>
  )
}

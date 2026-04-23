import React from 'react'
import { getWeather } from './helper'
import { Weather } from '@/type'
import './weather.less'

export interface WeatherProps {
  [key: string]: any
}

export default function WeatherModule(props: WeatherProps) {
  const {} = props
  const [weather, setWeather] = React.useState<Weather[]>([])

  const init = async () => {
    const weather = await getWeather()
    setWeather(weather || [])
  }
  React.useEffect(() => {
    init()
  }, [])
  return (
    <div className='weather-module'>
      <div className="weather-box">
        {weather.map((w: Weather) => {
          const { date, min, max, mm, weather } = w
          return (
            <div key={date} className="weather-item">
              <div className="weather">{weather}</div>
              <div className="temperature-max">{max} ℃</div>
              <div className="temperature-min">{min} ℃</div>
              {/* {mm> 0 && <div className="mm">{mm}mm</div>} */}
              <div className="date">
                {date.replace(/\d\d\d\d-/, '').replace('-', '/')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

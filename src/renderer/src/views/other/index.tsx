import './index.less'
import WeatherModule from './modules/weather/weather'

export default function Other() {
  return (
    <div className="page__other">
      <WeatherModule />
      <div className="page__other-container">
      </div>
    </div>
  )
}

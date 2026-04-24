import { ObjectType } from '0type'
import { Weather } from '@/type'

export const toOptions = (weather: Weather[], count: ObjectType<number>) => {
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
  return options
}

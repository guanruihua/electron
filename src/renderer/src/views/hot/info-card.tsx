import { useHotStore } from './store'
import { isArray, isString } from 'asura-eye'

type Props = {
  type: string
}
export default function InfoCard(props: Props) {
  const { type } = props
  const wv = useHotStore()
  const data = wv?.Data?.[type]?.hot || []

  return (
    <div className="info-card">
      {data?.length > 0 ? (
        <div className="info-card-container">
          {data.map((item, i) => {
            const { hot, logo, title, url, data } = item
            return (
              <div
                className="info-card-item"
                key={i}
                onClick={() => {
                  url && window.api.invoke('url', url)
                }}
              >
                <div className="left">
                  <div className="title">
                    {i + 1}. {title}
                  </div>
                  {isString(hot) && (
                    <div className="hot">{hot.replace('分享', '')}</div>
                  )}
                </div>
                {logo && (
                  <div className="logo">
                    <img src={logo} />
                  </div>
                )}
                {type === 'jinjia' && isArray(data) && (
                  <div className="jinjia">
                    {data.map((row, j) => {
                      return (
                        <div className="jinjia-row" key={j}>
                          <div className="title">{row.title}</div>
                          <div className="new">{row.new}</div>
                          <div className="rise">{row.rise}</div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className='info-card-empty'>Empty</p>
      )}
    </div>
  )
}

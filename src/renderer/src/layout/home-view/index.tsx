import { Button } from 'antd'

export interface HomeViewProps {
  [key: string]: any
}

export function HomeView(props: HomeViewProps) {
  const { handle } = props

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <span
        style={{
          fontWeight: 'bold',
          fontSize: 24,
        }}
      >
        Home
      </span>
      <div className="flex">
        <Button
          onClick={() => {
            window.api.openMaskWindow()
          }}
        >
          打开遮罩
        </Button>
        <Button onClick={handle.openDevtool}>
          <span style={{}}>Devtool</span>
        </Button>
        <Button onClick={handle.reload}>
          <span style={{}}>Reload</span>
        </Button>
      </div>
    </div>
  )
}

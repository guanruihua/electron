export interface HomeViewProps {
  [key: string]: any
}

export function HomeView(props: HomeViewProps) {
  // const { url } = props
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
    </div>
  )
}

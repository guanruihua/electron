import { classNames } from 'harpe'

export interface AppCardProps {
  [key: string]: any
}

export function AppCard(props: AppCardProps) {
  const { className, item, ...rest } = props
  const {
    // iconDataURL = '',
    path = '',
    fullPath = '',
    description = '',
  } = item || {}
  const name = fullPath
    .split(/\\/)
    .at(-1)
    ?.replace(/\.(lnk|exe)$/, '')
  // console.log({ item })

  return (
    <div
      className={classNames('app-card', className)}
      title={description}
      onClick={() => {
        window.api.openPath(path)
      }}
      {...rest}
    >
      <div className="logo">
        {/* {iconDataURL ? (
          <img src={iconDataURL} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="#DADCE0"
              d="M13 9V3.5L18.5 9M6 2c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
            ></path>
          </svg>
        )} */}
      </div>
      <div className="name">{name}</div>
    </div>
  )
}

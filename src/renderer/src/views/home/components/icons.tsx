import React from 'react'

interface IconProps extends React.DOMAttributes<SVGSVGElement> {
  type: 'back' | 'forward' | 'reload' | 'home' | 'close' | 'add'
  [key: string]: any
}
export function Icon(props: IconProps) {
  const { type, ...rest } = props
  if (type === 'add')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
        ></path>
      </svg>
    )
  if (type === 'close')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
        ></path>
      </svg>
    )

  if (type === 'reload')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 512 512"
        {...rest}
      >
        <path
          fill="currentColor"
          stroke="currentColor"
          fillRule="evenodd"
          d="M298.667 213.333v-42.666l79.898-.003c-26.986-38.686-71.82-63.997-122.565-63.997c-82.475 0-149.333 66.858-149.333 149.333S173.525 405.333 256 405.333c76.201 0 139.072-57.074 148.195-130.807l42.342 5.292C434.807 374.618 353.974 448 256 448c-106.039 0-192-85.961-192-192S149.961 64 256 64c60.316 0 114.136 27.813 149.335 71.313L405.333 64H448v149.333z"
        ></path>
      </svg>
    )
  if (type === 'back')
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <path
          fill="currentColor"
          stroke="currentColor"
          d="M19 12H5M5 12L12 5M5 12L12 19"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  if (type === 'forward')
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <path
          fill="currentColor"
          stroke="currentColor"
          d="M5 12H19M19 12L12 5M19 12L12 19"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  if (type === 'home')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...rest}
      >
        <path
          fill="currentColor"
          d="M6 19h3v-5q0-.425.288-.712T10 13h4q.425 0 .713.288T15 14v5h3v-9l-6-4.5L6 10zm-2 0v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-4q-.425 0-.712-.288T13 20v-5h-2v5q0 .425-.288.713T10 21H6q-.825 0-1.412-.587T4 19m8-6.75"
        ></path>
      </svg>
    )
  return <span></span>
}

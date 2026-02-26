import React from 'react'

interface IconProps extends React.DOMAttributes<SVGSVGElement> {
  type:
    | 'back'
    | 'forward'
    | 'reload'
    | 'home'
    | 'close'
    | 'add'
    | 'stop'
    | 'run'
    | 'open'
    | 'web'
    | 'google'
    | 'vscode'
    | 'dir'
    | 'file'
    | 'badge-success'
    | 'badge-warning'
    | 'badge-error'
    | 'right-arrow'
    | 'git'
  [key: string]: any
}
export function Icon(props: IconProps) {
  const { type, ...rest } = props
  if (type === 'git')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 32 32"
        {...rest}
      >
        <path
          fill="#e64a19"
          d="M13.172 2.828L11.78 4.22l1.91 1.91l2 2A2.986 2.986 0 0 1 20 10.81a3.25 3.25 0 0 1-.31 1.31l2.06 2a2.68 2.68 0 0 1 3.37.57a2.86 2.86 0 0 1 .88 2.117a3.02 3.02 0 0 1-.856 2.109A2.9 2.9 0 0 1 23 19.81a2.93 2.93 0 0 1-2.13-.87a2.694 2.694 0 0 1-.56-3.38l-2-2.06a3 3 0 0 1-.31.12V20a3 3 0 0 1 1.44 1.09a2.92 2.92 0 0 1 .56 1.72a2.88 2.88 0 0 1-.878 2.128a2.98 2.98 0 0 1-2.048.871a2.981 2.981 0 0 1-2.514-4.719A3 3 0 0 1 16 20v-6.38a2.96 2.96 0 0 1-1.44-1.09a2.9 2.9 0 0 1-.56-1.72a2.9 2.9 0 0 1 .31-1.31l-3.9-3.9l-7.579 7.572a4 4 0 0 0-.001 5.658l10.342 10.342a4 4 0 0 0 5.656 0l10.344-10.344a4 4 0 0 0 0-5.656L18.828 2.828a4 4 0 0 0-5.656 0"
        ></path>
      </svg>
    )
  if (type === 'right-arrow')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0.5em"
        height="1em"
        viewBox="0 0 12 24"
        {...rest}
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"
        ></path>
      </svg>
    )
  if (type === 'file')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...rest}
      >
        <defs>
          <mask id="SVGg6iutdra">
            <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
              <path
                fill="#fff"
                stroke="#fff"
                d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z"
              ></path>
              <path stroke="#000" d="M14 3.5l0 4.5l4.5 0Z"></path>
            </g>
          </mask>
        </defs>
        <path fill="#8e9da6" d="M0 0h24v24H0z" mask="url(#SVGg6iutdra)"></path>
        <path
          fill="none"
          stroke="#8e9da6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.5 3l5.5 5.5"
        ></path>
      </svg>
    )
  if (type === 'badge-success')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 48 48"
        {...rest}
      >
        <defs>
          <mask id="SVGIQLGgV2F">
            <g fill="none" strokeLinejoin="round" strokeWidth={4}>
              <path
                fill="#fff"
                stroke="#fff"
                d="M24 44a19.94 19.94 0 0 0 14.142-5.858A19.94 19.94 0 0 0 44 24a19.94 19.94 0 0 0-5.858-14.142A19.94 19.94 0 0 0 24 4A19.94 19.94 0 0 0 9.858 9.858A19.94 19.94 0 0 0 4 24a19.94 19.94 0 0 0 5.858 14.142A19.94 19.94 0 0 0 24 44Z"
              ></path>
              <path
                stroke="#000"
                strokeLinecap="round"
                d="m16 24l6 6l12-12"
              ></path>
            </g>
          </mask>
        </defs>
        <path fill="#19cb6c" d="M0 0h48v48H0z" mask="url(#SVGIQLGgV2F)"></path>
      </svg>
    )
  if (type === 'badge-warning')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...rest}
      >
        <path
          fill="#fcac3b"
          d="M12.713 16.713Q13 16.425 13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17t.713-.288m0-4Q13 12.425 13 12V8q0-.425-.288-.712T12 7t-.712.288T11 8v4q0 .425.288.713T12 13t.713-.288M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
        ></path>
      </svg>
    )
  if (type === 'badge-error')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 512 512"
        {...rest}
      >
        <path
          fill="#ff5b58"
          fillRule="evenodd"
          d="M256 42.667c117.803 0 213.334 95.53 213.334 213.333S373.803 469.334 256 469.334S42.667 373.803 42.667 256S138.197 42.667 256 42.667m48.918 134.25L256 225.836l-48.917-48.917l-30.165 30.165L225.835 256l-48.917 48.918l30.165 30.165L256 286.166l48.918 48.917l30.165-30.165L286.166 256l48.917-48.917z"
        ></path>
      </svg>
    )
  if (type === 'dir')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 36 36"
        {...rest}
      >
        <path
          fill="#ffd561"
          d="M30 9H16.42l-2.31-3.18A2 2 0 0 0 12.49 5H6a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2M6 11V7h6.49l2.72 4Z"
          className="clr-i-solid clr-i-solid-path-1"
        ></path>
        <path fill="none" d="M0 0h36v36H0z"></path>
      </svg>
    )
  if (type === 'vscode')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 32 32"
        {...rest}
      >
        <path
          fill="#0065a9"
          d="m29.01 5.03l-5.766-2.776a1.74 1.74 0 0 0-1.989.338L2.38 19.8a1.166 1.166 0 0 0-.08 1.647q.037.04.077.077l1.541 1.4a1.165 1.165 0 0 0 1.489.066L28.142 5.75A1.158 1.158 0 0 1 30 6.672v-.067a1.75 1.75 0 0 0-.99-1.575"
        ></path>
        <path
          fill="#007acc"
          d="m29.01 26.97l-5.766 2.777a1.745 1.745 0 0 1-1.989-.338L2.38 12.2a1.166 1.166 0 0 1-.08-1.647q.037-.04.077-.077l1.541-1.4A1.165 1.165 0 0 1 5.41 9.01l22.732 17.24A1.158 1.158 0 0 0 30 25.328v.072a1.75 1.75 0 0 1-.99 1.57"
        ></path>
        <path
          fill="#1f9cf0"
          d="M23.244 29.747a1.745 1.745 0 0 1-1.989-.338A1.025 1.025 0 0 0 23 28.684V3.316a1.024 1.024 0 0 0-1.749-.724a1.74 1.74 0 0 1 1.989-.339l5.765 2.772A1.75 1.75 0 0 1 30 6.6v18.8a1.75 1.75 0 0 1-.991 1.576Z"
        ></path>
      </svg>
    )
  if (type === 'google')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 256 256"
        {...rest}
      >
        <path
          fill="#fff"
          d="M128.003 199.216c39.335 0 71.221-31.888 71.221-71.223S167.338 56.77 128.003 56.77S56.78 88.658 56.78 127.993s31.887 71.223 71.222 71.223"
        ></path>
        <path
          fill="#229342"
          d="M35.89 92.997Q27.92 79.192 17.154 64.02a127.98 127.98 0 0 0 110.857 191.981q17.671-24.785 23.996-35.74q12.148-21.042 31.423-60.251v-.015a63.993 63.993 0 0 1-110.857.017Q46.395 111.19 35.89 92.998"
        ></path>
        <path
          fill="#fbc116"
          d="M128.008 255.996A127.97 127.97 0 0 0 256 127.997A128 128 0 0 0 238.837 64q-36.372-3.585-53.686-3.585q-19.632 0-57.152 3.585l-.014.01a63.99 63.99 0 0 1 55.444 31.987a63.99 63.99 0 0 1-.001 64.01z"
        ></path>
        <path
          fill="#1a73e8"
          d="M128.003 178.677c27.984 0 50.669-22.685 50.669-50.67s-22.685-50.67-50.67-50.67c-27.983 0-50.669 22.686-50.669 50.67s22.686 50.67 50.67 50.67"
        ></path>
        <path
          fill="#e33b2e"
          d="M128.003 64.004H238.84a127.973 127.973 0 0 0-221.685.015l55.419 95.99l.015.008a63.993 63.993 0 0 1 55.415-96.014z"
        ></path>
      </svg>
    )
  // return (
  //   <svg
  //     xmlns="http://www.w3.org/2000/svg"
  //     width="1em"
  //     height="1em"
  //     viewBox="0 0 16 16"
  //     {...rest}
  //   >
  //     <g fill="none" fillRule="evenodd" clipRule="evenodd">
  //       <path
  //         fill="#f44336"
  //         d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
  //         opacity={0.987}
  //       ></path>
  //       <path
  //         fill="#ffc107"
  //         d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
  //         opacity={0.997}
  //       ></path>
  //       <path
  //         fill="#448aff"
  //         d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
  //         opacity={0.999}
  //       ></path>
  //       <path
  //         fill="#43a047"
  //         d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
  //         opacity={0.993}
  //       ></path>
  //     </g>
  //   </svg>
  // )
  if (type === 'web')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 48 48"
        {...rest}
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M16.392 6.312a19.33 19.33 0 0 0-8.944 7.854h5.991c.47-2.082 1.09-3.996 1.836-5.677a21 21 0 0 1 1.117-2.177M4.75 24c0-1.49.17-2.941.49-4.334h7.346A48 48 0 0 0 12.393 24c0 1.476.065 2.925.193 4.332H5.239A19.3 19.3 0 0 1 4.75 24m2.697 9.832a19.33 19.33 0 0 0 8.945 7.856a21 21 0 0 1-1.117-2.177c-.747-1.681-1.366-3.596-1.836-5.679zm11.139 0a24.4 24.4 0 0 0 1.259 3.649c.739 1.664 1.554 2.855 2.334 3.597c.766.73 1.377.922 1.82.922s1.055-.192 1.822-.922c.779-.742 1.595-1.933 2.334-3.597c.477-1.075.902-2.3 1.259-3.649zm15.975 0c-.47 2.083-1.09 3.998-1.837 5.679a21 21 0 0 1-1.117 2.177a19.33 19.33 0 0 0 8.946-7.856zm8.2-5.5h-7.347A48 48 0 0 0 35.607 24c0-1.477-.066-2.926-.193-4.334h7.346c.32 1.393.49 2.844.49 4.334s-.17 2.94-.49 4.332m-12.37 0H17.608A43 43 0 0 1 17.393 24c0-1.5.075-2.95.216-4.334H30.39c.14 1.384.216 2.835.216 4.334s-.075 2.948-.216 4.332m4.17-14.166h5.991a19.33 19.33 0 0 0-8.945-7.854c.406.684.778 1.415 1.117 2.177c.747 1.68 1.366 3.595 1.836 5.677m-14.716-3.647a24.4 24.4 0 0 0-1.259 3.647h10.827a24.4 24.4 0 0 0-1.258-3.647c-.74-1.664-1.555-2.855-2.334-3.597C25.054 6.192 24.443 6 24 6s-1.055.192-1.821.922c-.78.742-1.595 1.933-2.334 3.597M24 .75C11.16.75.75 11.16.75 24S11.16 47.25 24 47.25S47.25 36.84 47.25 24S36.84.75 24 .75"
          clipRule="evenodd"
        ></path>
      </svg>
    )
  if (type === 'stop')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...rest}
      >
        <g fill="none" fillRule="evenodd">
          <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
          <path
            fill="currentColor"
            d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
          ></path>
        </g>
      </svg>
    )
  if (type === 'run')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        {...rest}
      >
        <path
          fill="currentColor"
          d="M4.506 3.503L12.501 8l-8 4.5zm-.004-1.505C3.718 1.998 3 2.626 3 3.5v9c0 .874.718 1.502 1.502 1.502c.245 0 .496-.061.733-.195l8-4.5c1.019-.573 1.019-2.041 0-2.615l-8-4.499a1.5 1.5 0 0 0-.733-.195"
        ></path>
      </svg>
    )
  if (type === 'open')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...rest}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4m-8-2l8-8m0 0v5m0-5h-5"
        ></path>
      </svg>
    )
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

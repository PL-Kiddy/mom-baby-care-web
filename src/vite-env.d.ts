/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.JPG' {
  const src: string
  export default src
}

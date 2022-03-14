import { CSSProperties, ReactNode } from 'react'

export type RouterPageProps = {
  status: 'show' | 'hide'
  children?: ReactNode
}

const hideStyle: CSSProperties = {
  display: 'none'
}

const RouterPage = ({ status, children }: RouterPageProps) => {
  return (
    <div
      children={children}
      style={status === 'hide' ? hideStyle : undefined}
    />
  )
}

export default RouterPage

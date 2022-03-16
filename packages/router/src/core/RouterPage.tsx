import { CSSProperties, ReactNode } from 'react'
import { PageContext } from 'src/context/PageContext'

export type RouterPageProps = {
  status: 'show' | 'hide'
  children?: ReactNode
}

const hideStyle: CSSProperties = Object.freeze({
  display: 'none'
})

const RouterPage = ({ status, children }: RouterPageProps) => {
  return (
    <PageContext.Provider value={{ status }}>
      <div
        children={children}
        style={status === 'hide' ? hideStyle : undefined}
      />
    </PageContext.Provider>
  )
}

export default RouterPage

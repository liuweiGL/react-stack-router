import { useMemo } from 'react'

import { createBrowserHistory, createHashHistory, History } from 'history'

import { LocationProvider } from '../context/LocationContext'
import { NavigationProvider } from '../context/NavigationContext'
import { useMatch } from '../hooks/useMatch'

import { Route } from './route'
import RouterPage from './RouterPage'
import { StackRoute } from './stack'

export type RouterProps = {
  basename?: string
  history: History
  routes: Route[]
}

const renderRoutes = (routes: StackRoute[]) => {
  return routes.map(({ pageKey, component: RouteComponent }, index) => {
    const status = index === routes.length - 1 ? 'show' : 'hide'
    return (
      <RouterPage key={pageKey} status={status}>
        <RouteComponent />
      </RouterPage>
    )
  })
}

export const Router = ({ basename = '/', history, routes }: RouterProps) => {
  const {
    matches,
    location,
    history: proHistory
  } = useMatch({ basename, history, routes })

  const children = renderRoutes(matches)

  return (
    <NavigationProvider value={{ navigator: proHistory }}>
      <LocationProvider children={children} value={{ location }} />
    </NavigationProvider>
  )
}

export type BrowserRouterProps = {
  basename?: string
  routes: Route[]
}

export const BrowserRouter = ({ basename, routes }: BrowserRouterProps) => {
  const history = useMemo(() => createBrowserHistory({ window }), [])

  return <Router basename={basename} history={history} routes={routes} />
}

export type HashRouterProps = BrowserRouterProps

export const HashRouter = ({ basename, routes }: HashRouterProps) => {
  const history = useMemo(() => createHashHistory({ window }), [])

  return <Router basename={basename} history={history} routes={routes} />
}

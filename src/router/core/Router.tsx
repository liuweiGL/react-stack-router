import { useLayoutEffect, useMemo, useState } from 'react'

import { createBrowserHistory, createHashHistory, History } from 'history'

import { LocationProvider } from '../context/LocationContext'
import { NavigationProvider } from '../context/NavigationContext'
import useCreation from '../hooks/useCreation'
import { useForceUpdate } from '../hooks/useForceUpdate'

import { ProHistory } from './history'
import { Route } from './route'
import RouterPage from './RouterPage'
import { Stack, StackRoute } from './stack'

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
  const update = useForceUpdate()

  const stack = useCreation(
    {
      factory: () => new Stack(update)
    },
    []
  )

  const proHistory = useCreation(
    {
      factory: () => new ProHistory({ basename, history, routes, stack }),
      unmount: t => t.destroy()
    },
    [basename, history, routes, stack]
  )

  const [location, setLocation] = useState(history.location)

  useLayoutEffect(() => {
    return history.listen(({ location }) => setLocation(location))
  }, [history])

  const children = renderRoutes(stack.items)

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

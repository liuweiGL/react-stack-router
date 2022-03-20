import { useMemo, useState } from 'react'
import { Freeze } from 'react-freeze'

import { createBrowserHistory, createHashHistory, History } from 'history'

import { LocationContext } from '../../context/LocationContext'
import { NavigationContext } from '../../context/NavigationContext'
import { RouteContext } from '../../context/RouteContext'
import { ProHistory, ProInfo } from '../../core/history'
import { MatchRecord, Route } from '../../core/route'
import useCreation from '../../hooks/useCreation'
import { DEFAULT_PATH_404 } from '../../utils/constants'
import NotFound from '../NotFound'

export type RouterProps = {
  basename?: string
  history: History
  routes: Route[]
}

const defaultRoute = {
  path: DEFAULT_PATH_404,
  component: NotFound
}

const renderRoutes = (records: MatchRecord[]) => {
  const { length } = records

  return records.map((record, index) => {
    const { pageKey, node, params } = record

    const status = index === length - 1 ? 'show' : 'hide'

    return (
      <RouteContext.Provider
        key={pageKey}
        value={{ status, params, current: record, matches: records }}
      >
        <Freeze freeze={status === 'hide'}>{node}</Freeze>
      </RouteContext.Provider>
    )
  })
}

export const Router = ({ basename = '/', history, routes }: RouterProps) => {
  const [{ location, records }, setState] = useState<ProInfo>({
    location: history.location,
    records: []
  })

  const mergedRoutes = useMemo(() => [...routes, defaultRoute], [routes])

  const proHistory = useCreation(
    {
      factory: () =>
        new ProHistory({
          basename,
          history,
          routes: mergedRoutes,
          subscriber: setState
        }),
      unmount: t => t.destroy()
    },
    [basename, history, mergedRoutes]
  )

  const children = renderRoutes(records)

  return (
    <NavigationContext.Provider value={{ navigator: proHistory }}>
      <LocationContext.Provider children={children} value={{ location }} />
    </NavigationContext.Provider>
  )
}

export type BrowserRouterProps = Omit<RouterProps, 'history'>

export const BrowserRouter = (props: BrowserRouterProps) => {
  const history = useMemo(() => createBrowserHistory({ window }), [])

  return <Router {...props} history={history} />
}

export type HashRouterProps = BrowserRouterProps

export const HashRouter = (props: HashRouterProps) => {
  const history = useMemo(() => createHashHistory({ window }), [])

  return <Router {...props} history={history} />
}

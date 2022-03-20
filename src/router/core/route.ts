import {
  ComponentClass,
  ComponentType,
  createElement,
  FunctionComponent,
  ReactElement,
  ReactNode
} from 'react'

import { warning } from '../utils/diagnosis'

export type LazyComponent = () => Promise<{
  default: ComponentType<any>
}>

export type RouteComponent = FunctionComponent | ComponentClass | LazyComponent

export type RouteStatus = 'show' | 'hide'

type BaseRoute<T> = {
  // 是否是首页
  index?: boolean
  // 唯一标识
  name?: string
  path: string
  meta?: T
}

export type PageRoute<T = any> = BaseRoute<T> & {
  type?: 'page'
}

export type TabRoute<T = any> = BaseRoute<T> & {
  type: 'tab'
  icon?: ReactNode
}

export type RouteRaw<T = any> = PageRoute<T> | TabRoute<T>

export type Route<T = any> = RouteRaw<T> & {
  component: RouteComponent
}

export type NormalizedRoute = RouteRaw<any> & {
  component: Exclude<RouteComponent, LazyComponent>
}

export type RecordRaw<T = any> = RouteRaw<T> & {
  pageKey: string
  // It's helpful to recover browser url when user navigate back
  url: string
  params: Record<any, any>
}

export type ResolveRecord<T = any> = RecordRaw<T> & {
  component: Exclude<RouteComponent, LazyComponent>
}

export type MatchRecord<T = any> = RecordRaw<T> & {
  node: ReactElement
}

export const isTabRoute = (route: RouteRaw): route is TabRoute => {
  return route.type === 'tab'
}

export const isPageRoute = (route: RouteRaw): route is PageRoute => {
  return route.type === undefined || route.type === 'page'
}

export const isSameRoute = (route1: RouteRaw, route2: RouteRaw) => {
  return route1.name === route2.name || route1.path === route2.path
}

export const matchRoute = (routes: Route[], nameOrPath?: string) => {
  let route: Route | undefined

  if (nameOrPath) {
    route = routes.find(
      ({ name, path }) => name === nameOrPath || path === nameOrPath
    )
  }

  warning(!route, `Route not found when name or path is  \`${nameOrPath}\` `)

  return route
}

export const getMatchRecord = ({
  component,
  ...restRecord
}: ResolveRecord): MatchRecord => {
  return {
    ...restRecord,
    node: createElement(component, { key: restRecord.pageKey })
  }
}

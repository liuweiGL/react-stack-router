import {
  ComponentClass,
  ComponentType,
  FunctionComponent,
  ReactNode
} from 'react'

import { warning } from '../utils/diagnosis'

export type LazyComponent = () => Promise<{
  default: ComponentType<any>
}>

export type RouteComponent = FunctionComponent | ComponentClass | LazyComponent

type BaseRoute<Meta> = {
  // 是否是首页
  index?: boolean
  // 唯一标识
  name?: string
  path: string
  meta?: Meta
}

export type PageRoute<Meta = any> = BaseRoute<Meta> & {
  type?: 'page'
}

export type TabRoute<Meta = any> = BaseRoute<Meta> & {
  type: 'tab'
  icon?: ReactNode
}

export type RouteRaw<Meta = any> = PageRoute<Meta> | TabRoute<Meta>

export type Route<Meta = any> = RouteRaw<Meta> & {
  component: RouteComponent
}

export type RouteRecord<Meta = any> = RouteRaw<Meta> & {
  component: Exclude<RouteComponent, LazyComponent>
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

  warning(
    !route,
    `Can not find the route when name or path is  \`${nameOrPath}\` `
  )

  return route
}

import {
  ComponentClass,
  ComponentType,
  FunctionComponent,
  ReactNode
} from 'react'

import { Location } from 'history'

import { warning } from '../utils/diagnosis'

export type RouteComponent = FunctionComponent | ComponentClass
// | (() => Promise<{
//     default: ComponentType<any>
//   }>)

type CommonRoute = {
  // 是否是首页
  index?: boolean
  // 唯一标识
  name?: string
  // 页面标题
  title: string
  path: string
  component: RouteComponent
}

export type PageRoute = CommonRoute & {
  type?: 'page'
}

export type TabRoute = CommonRoute & {
  type: 'tab'
  icon: ReactNode
}

export type Route = PageRoute | TabRoute

export const isTabRoute = (route: Route): route is TabRoute => {
  return route.type === 'tab'
}

export const isPageRoute = (route: Route): route is PageRoute => {
  return route.type === undefined || route.type === 'page'
}

export const isSameRoute = (route1: Route, route2: Route) => {
  return route1.name === route2.name || route1.path === route2.path
}

export const matchRoute = (routes: Route[], nameOrPath?: string) => {
  let route: Route | undefined

  if (nameOrPath) {
    route = routes.find(
      ({ name, path }) => name === nameOrPath || path === nameOrPath
    )
  }

  warning(!route, `无法根据值为 ${nameOrPath} 的 name 或者 path 找到对应路由`)

  return route
}

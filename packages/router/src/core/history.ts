import { createPath, History, parsePath, Path, To, Update } from 'history'

import { Noop } from '../utils/function'
import {
  getPageKey,
  joinPaths,
  normalizePath,
  setPageKey,
  stripBasename
} from '../utils/url'

import { isTabRoute, matchRoute, Route } from './route'
import { Stack } from './stack'

export type ProTo =
  | To
  | {
      name: string
    }

export type ProUpdate = Update & {
  route: Route
}

export type ProListener = (options: ProUpdate) => void

export type HistoryProps = {
  basename: string
  history: History
  routes: Route[]
  stack: Stack
}

export class ProHistory {
  basename: string
  private history: History
  private routes: Route[]
  private stack: Stack
  private listeners: ProListener[] = []
  private unlisteners: Noop[] = []

  constructor({ basename, history, routes, stack }: HistoryProps) {
    this.basename = normalizePath(basename)
    this.routes = routes
    this.stack = stack
    this.history = history

    this.initSubscriber()
    this.initWatcher()
    this.loadIndexPage()
  }

  get location() {
    return this.history.location
  }

  private get indexRoute() {
    return this.routes.find(item => item.index) || this.routes[0]
  }

  /**
   * 包装 history 的 listen 事件，处理 basename
   */
  private initSubscriber() {
    const unlistener = this.history.listen(options => {
      const {
        location: { pathname }
      } = options
      const path = stripBasename(this.basename, pathname)
      if (!path) {
        return
      }
      const route = matchRoute(this.routes, path)
      if (!route) {
        return
      }
      this.listeners.forEach(listen => {
        listen({
          ...options,
          route
        })
      })
    })
    this.unlisteners.push(unlistener)
  }

  /**
   * 当 history 变化时维护路由
   */
  private initWatcher() {
    this.listen(({ route, location }) => {
      const url = createPath(location)
      if (isTabRoute(route)) {
        this.stack.switchTab({
          url,
          ...route
        })
        return
      }

      const pageKey = getPageKey(location)

      if (pageKey) {
        this.stack.jumpPage({
          pageKey,
          url,
          ...route
        })
      } else {
        this.history.replace(setPageKey(location))
      }
    })
  }

  /**
   * 加载首页
   */
  private loadIndexPage() {
    this.replace(this.indexRoute.path)
  }

  listen(listener: ProListener) {
    this.listeners.push(listener)

    const index = this.listeners.length - 1

    return () => {
      this.listeners.splice(index, 1)
    }
  }

  private resolveTo(to: ProTo) {
    let path: Partial<Path> | undefined

    if (typeof to === 'string') {
      path = parsePath(to)
    } else if ('pathname' in to) {
      path = to
    } else if ('name' in to) {
      const route = matchRoute(this.routes, to.name)

      path = route
        ? {
            pathname: route.path
          }
        : undefined
    }

    if (path?.pathname) {
      path.pathname = joinPaths(this.basename, path.pathname)
      path = setPageKey(path)
    }

    return path
  }

  push(to: ProTo) {
    const result = this.resolveTo(to)

    if (result) {
      this.history.push(result)
    }
  }

  replace(to: To) {
    const result = this.resolveTo(to)

    if (result) {
      this.history.replace(result)
    }
  }

  back(delta = 1) {
    const prePage = this.stack.getLastItem(delta)

    this.history.replace(prePage.url)
  }

  reset() {
    this.stack.clear()
  }

  createHref(to: ProTo) {
    const result = this.resolveTo(to)

    if (result) {
      return this.history.createHref(result)
    }

    return undefined
  }

  destroy() {
    this.unlisteners.forEach(item => item())
  }
}

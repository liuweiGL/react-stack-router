import { createPath, History, parsePath, Path, To, Update } from 'history'

import { isLazyComponent, loadLazyComponent } from '../utils/component'
import { Noop } from '../utils/function'
import {
  containBasename,
  getPageKey,
  joinPaths,
  normalizePath,
  setPageKey,
  stripBasename
} from '../utils/url'

import { isTabRoute, matchRoute, Route, RouteRecord } from './route'
import { Stack } from './stack'

type ProState = {
  blockerId: number
}

export type ProTo =
  | To
  | {
      name: string
    }

export type ProUpdate = Update & {
  route: RouteRecord
}

export type ProListener = (options: ProUpdate) => void

export type ProBlocker = (options: ProUpdate) => boolean | undefined

export type HistoryProps = {
  basename: string
  history: History
  routes: Route[]
  stack: Stack
}

export class ProHistory {
  public basename: string
  private history: History
  private routes: Route[]
  private stack: Stack

  private routeRecordMap: Map<string, RouteRecord>
  private blockerMap: Map<number, ProBlocker>

  private listeners: ProListener[] = []
  private unlisteners: Noop[] = []

  constructor({ basename, history, routes, stack }: HistoryProps) {
    this.basename = normalizePath(basename)
    this.routes = routes
    this.stack = stack
    this.history = history
    this.routeRecordMap = new Map()
    this.blockerMap = new Map()

    this.initSubscriber()
    this.initWatcher()
    this.loadIndexPage()
  }

  get location() {
    return this.history.location
  }

  get currentRoute() {
    return this.stack.current
  }

  get stackSnapshoot() {
    return this.stack.items.slice()
  }

  private get indexRoute() {
    return this.routes.find(item => item.index) || this.routes[0]
  }

  private containBasename(pathname: string) {
    return containBasename(this.basename, pathname)
  }

  private async resolveRouteRecord(pathname: string) {
    const route = matchRoute(this.routes, pathname)

    if (!route) {
      return
    }

    const { path, component } = route
    if (this.routeRecordMap.has(path)) {
      return this.routeRecordMap.get(path)
    }

    let routeRecord: RouteRecord

    if (isLazyComponent(component)) {
      const resolvedComponent = await loadLazyComponent(component)

      if (!resolvedComponent) {
        throw new Error(`Couldn't resolve component  at "${path}"`)
      }

      routeRecord = {
        ...route,
        component: resolvedComponent
      }
    } else {
      routeRecord = {
        ...route,
        component
      }
    }

    this.routeRecordMap.set(path, routeRecord)

    return routeRecord
  }

  /**
   * 包装 history 的 listen 事件，处理 basename
   */
  private initSubscriber() {
    const unlistener = this.history.listen(async options => {
      const {
        location: { pathname, state }
      } = options

      const path = stripBasename(this.basename, pathname)

      if (!path) {
        return
      }

      const route = await this.resolveRouteRecord(path)

      if (!route) {
        return
      }

      const proOptions = {
        ...options,
        route
      }

      if (state) {
        const { blockerId } = state as ProState

        const blocker = this.blockerMap.get(blockerId)

        if (blocker && blocker(proOptions) === false) {
          this.blockerMap.delete(blockerId)
          return
        }
      }

      this.listeners.forEach(listen => {
        listen(proOptions)
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

      const pageKey = getPageKey(location)

      if (pageKey) {
        const stackRoute = {
          pageKey,
          url,
          ...route
        }

        if (isTabRoute(route)) {
          this.stack.switchTab(stackRoute)
        } else {
          this.stack.jumpPage(stackRoute)
        }
      } else {
        this.history.replace(setPageKey(location))
      }
    })
  }

  /**
   * 如果当前路径根 basename 不匹配时，默认加载首页
   */
  private loadIndexPage() {
    if (this.containBasename(this.location.pathname)) {
      this.replace(this.location)
    } else {
      this.replace(this.indexRoute.path)
    }
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
      path = Object.assign({}, to)
    } else if ('name' in to) {
      const route = matchRoute(this.routes, to.name)

      path = route
        ? {
            pathname: route.path
          }
        : undefined
    }

    if (path?.pathname) {
      if (!this.containBasename(path.pathname)) {
        path.pathname = joinPaths(this.basename, path.pathname)
      }
      path = setPageKey(path)
    }

    return path
  }

  push(to: ProTo, blocker?: ProBlocker) {
    const result = this.resolveTo(to)

    if (result) {
      let state
      if (blocker) {
        const blockerId = Date.now()
        state = { blockerId }
        this.blockerMap.set(blockerId, blocker)
      }

      this.history.push(result, state)
    }
  }

  replace(to: ProTo) {
    const result = this.resolveTo(to)

    if (result) {
      this.stack.pop()
      this.history.replace(result)
    }
  }

  reset() {
    this.stack.clear()
  }

  back(delta = 1) {
    const prePage = this.stack.getLastItem(delta)

    this.history.replace(prePage.url)
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

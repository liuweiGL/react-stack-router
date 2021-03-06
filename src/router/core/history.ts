import { createPath, History, Location, parsePath, Path, To } from 'history'

import { isLazyComponent, loadLazyComponent } from '../utils/component'
import { DEFAULT_PATH_404, PAGE_KEY } from '../utils/constants'
import { Noop } from '../utils/function'
import {
  containBasename,
  createSearch,
  getPageKey,
  joinPaths,
  normalizePath,
  parseParams,
  setPageKey,
  stripBasename
} from '../utils/url'

import {
  isTabRoute,
  matchRoute,
  Route,
  NormalizedRoute,
  MatchRecord
} from './route'
import { Stack } from './stack'

type ProState = {
  blockerId: number
}

export type ProTo =
  | To
  | {
      url: string
      params?: Record<any, any>
    }
  | {
      name: string
      params?: Record<any, any>
    }

export type ProOptions = {
  pageKey: string
  route: NormalizedRoute
  location: Location
}

export type ProListener = (options: ProOptions) => void

export type ProBlocker = (options: ProOptions) => boolean | undefined

export type ProInfo = {
  location: Location
  records: MatchRecord[]
}

export type ProSubscriber = (options: ProInfo) => void

export type HistoryProps = {
  basename: string
  history: History
  routes: Route[]
  subscriber: ProSubscriber
}

export class ProHistory {
  public basename: string
  private history: History
  private routes: Route[]
  private subscriber: ProSubscriber

  private stack: Stack
  private routeResolveTimestamp?: number

  private routeMap: Map<string, NormalizedRoute> = new Map()
  private blockerMap: Map<number, ProBlocker> = new Map()

  private listeners: ProListener[] = []
  private unlisteners: Noop[] = []

  constructor({ basename, history, routes, subscriber }: HistoryProps) {
    this.basename = normalizePath(basename)
    this.routes = routes
    this.history = history
    this.subscriber = subscriber
    this.stack = new Stack()

    this.proxyHistoryEvent()
    this.registerController()
    this.loadFirstPage()
  }

  get location() {
    return this.history.location
  }

  private get indexRoute() {
    return this.routes.find(item => item.index) || this.routes[0]
  }

  /**
   * ???????????????????????????
   */
  private notify() {
    this.subscriber({
      location: this.location,
      records: this.stack.items
    })
  }

  private containBasename(pathname: string) {
    return containBasename(this.basename, pathname)
  }

  private matchRoute(pathname: string) {
    const route = matchRoute(this.routes, pathname)

    if (!route) {
      this.redirectTo404()
    }

    return route
  }

  private async resolveRoute(pathname: string) {
    const route = this.matchRoute(pathname)

    if (!route) {
      return
    }

    const { path, component } = route

    if (this.routeMap.has(path)) {
      return this.routeMap.get(path)
    }

    let result: NormalizedRoute

    if (isLazyComponent(component)) {
      const resolvedComponent = await loadLazyComponent(component)

      if (!resolvedComponent) {
        throw new Error(`Couldn't resolve component  at "${path}"`)
      }

      result = {
        ...route,
        component: resolvedComponent
      }
    } else {
      result = {
        ...route,
        component
      }
    }

    this.routeMap.set(path, result)

    return result
  }

  private redirectTo404() {
    // ???????????? this.matchRoute????????????????????????
    const route = matchRoute(this.routes, DEFAULT_PATH_404)

    if (route) {
      this.replace(DEFAULT_PATH_404)
    }
  }

  /**
   * ?????? history ??? listen ??????????????? basename ????????????????????????
   */
  private proxyHistoryEvent() {
    const unlistener = this.history.listen(async options => {
      const {
        location,
        location: { pathname, state }
      } = options

      const pageKey = getPageKey(location)

      if (!pageKey) {
        this.history.replace(setPageKey(location))
        return
      }

      const path = stripBasename(this.basename, pathname)

      if (!path) {
        return
      }

      const routeResolveTimestamp = Date.now()

      this.routeResolveTimestamp = routeResolveTimestamp

      const route = await this.resolveRoute(path)

      // ????????????????????????????????????????????? route ??? location ???????????????
      if (this.routeResolveTimestamp !== routeResolveTimestamp) {
        return
      }

      if (!route) {
        return
      }

      const proOptions = {
        ...options,
        route,
        pageKey
      }

      if (state) {
        const { blockerId } = state as ProState

        const blocker = this.blockerMap.get(blockerId)

        if (blocker && blocker(proOptions) === false) {
          this.blockerMap.delete(blockerId)
          return
        }
      }

      // ??? initWatcher ????????????????????????????????????????????????????????????????????????????????????
      for (let i = this.listeners.length - 1; i >= 0; i--) {
        this.listeners[i](proOptions)
      }
    })

    this.unlisteners.push(unlistener)
  }

  /**
   * ??? history ?????????????????????
   */
  private registerController() {
    this.on(({ route, pageKey, location }) => {
      const url = createPath(location)
      const params = parseParams(location.search)
      const record = {
        url,
        params,
        pageKey,
        ...route
      }

      if (isTabRoute(record)) {
        this.stack.switchTab(record)
      } else {
        this.stack.jumpPage(record)
      }

      this.notify()
    })
  }

  /**
   * ?????????????????????????????????????????? basename ??????????????????????????????
   */
  private loadFirstPage() {
    if (this.containBasename(this.location.pathname)) {
      this.replace(this.location)
    } else {
      this.replace(this.indexRoute.path)
    }
  }

  private resolveTo(to: ProTo) {
    let path: Partial<Path> | undefined

    if (typeof to === 'string') {
      path = parsePath(to)
    } else if ('pathname' in to) {
      path = Object.assign({}, to)
    } else if ('name' in to) {
      const route = this.matchRoute(to.name)

      if (!route) {
        return
      }

      path = {
        pathname: route.path,
        search: createSearch(to.params)
      }
    } else if ('url' in to) {
      path = parsePath(to.url)
      path.search = createSearch(
        Object.assign(parseParams(path.search), to.params)
      )
    }

    if (path?.pathname) {
      if (!this.containBasename(path.pathname)) {
        path.pathname = joinPaths(this.basename, path.pathname)
      }

      if (!parseParams(path.search)[PAGE_KEY]) {
        path = setPageKey(path)
      }
    }

    return path
  }

  on(listener: ProListener) {
    this.listeners.push(listener)

    const index = this.listeners.length - 1

    return () => {
      this.listeners.splice(index, 1)
    }
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

  reset(force?: boolean) {
    this.stack.clear(force)
  }

  back(delta = 1) {
    const prePage = this.stack.getLastItem(delta)

    if (prePage) {
      this.history.replace(prePage.url)
    }
  }

  createHref(to: ProTo) {
    const result = this.resolveTo(to)

    if (result) {
      return this.history.createHref(result)
    }

    return undefined
  }

  destroy = () => {
    this.unlisteners.forEach(item => item())
  }
}

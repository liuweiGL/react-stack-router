import { debounce } from '../utils/function'

import { isSameRoute, RouteRecord } from './route'

type Scheduler = () => void

export type StackRoute = RouteRecord & {
  pageKey?: string

  // 完整的地址，用于返回时恢复地址栏地址
  url: string
}

const createReactiveArray = (scheduler: Scheduler) => {
  const initial: StackRoute[] = []

  return new Proxy(initial, {
    get(target, key: any) {
      return target[key]
    },
    set(target, key: any, value) {
      target[key] = value

      debounce(scheduler, 50)

      return true
    }
  })
}

export class Stack {
  private tabs: StackRoute[]
  private pages: StackRoute[]

  constructor(scheduler: Scheduler) {
    this.tabs = createReactiveArray(scheduler)
    this.pages = createReactiveArray(scheduler)
  }

  get current() {
    return this.items[this.items.length - 1]
  }

  get items() {
    return [...this.tabs, ...this.pages]
  }

  private containsTab(item: StackRoute) {
    return this.tabs.some(tab => isSameRoute(tab, item))
  }

  private findPageIndex(item: StackRoute) {
    if (!item.pageKey) {
      return -1
    }

    return this.pages.findIndex(page => page.pageKey === item.pageKey)
  }

  /**
   * 从右往左取值，下标从 0 开始
   */
  getLastItem(delta: number) {
    return this.items[this.items.length - delta - 1]
  }

  switchTab(item: StackRoute) {
    if (this.containsTab(item)) {
      this.tabs.sort(tab => (isSameRoute(tab, item) ? -1 : 0))
    } else {
      this.tabs.push({ ...item })
    }

    this.clear()
  }

  jumpPage(item: StackRoute) {
    const pageIndex = this.findPageIndex(item)

    if (pageIndex > -1) {
      this.pages.splice(pageIndex + 1, this.pages.length - pageIndex - 1)
    } else {
      this.pages.push({ ...item })
    }
  }

  pop() {
    this.pages.pop()
  }

  clear() {
    this.pages.splice(0, this.pages.length)
  }
}

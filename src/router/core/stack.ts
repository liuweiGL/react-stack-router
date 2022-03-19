import { isSameRoute, RouteRecord } from './route'

type Scheduler = () => void

export type StackRoute = RouteRecord & {
  pageKey?: string

  // 完整的地址，用于返回时恢复地址栏地址
  url: string
}

export class Stack {
  private tabs: StackRoute[] = []
  private pages: StackRoute[] = []

  private scheduler: Scheduler

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler
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

    this.scheduler()
  }

  pop() {
    this.pages.pop()
    this.scheduler()
  }

  clear() {
    this.pages.splice(0, this.pages.length)
    this.scheduler()
  }
}

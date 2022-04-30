import { isSameRoute, MatchRecord, RecordRaw, RouteRaw } from './route'

export class Stack {
  private tabs: MatchRecord[] = []
  private pages: MatchRecord[] = []

  get current() {
    return this.items[this.items.length - 1]
  }

  get items() {
    return [...this.tabs, ...this.pages]
  }

  private containsTab(item: RouteRaw) {
    return this.tabs.some(tab => isSameRoute(tab, item))
  }

  private findPageIndex(item: RecordRaw) {
    if (!item.pageKey) {
      return -1
    }

    return this.pages.findIndex(page => page.pageKey === item.pageKey)
  }

  /**
   * 从右往左取值，下标从 0 开始
   */
  getLastItem(delta: number): MatchRecord | undefined {
    const { items } = this

    return items[items.length - delta - 1]
  }

  switchTab(record: MatchRecord) {
    if (this.containsTab(record)) {
      this.tabs.sort(tab => (isSameRoute(tab, record) ? -1 : 0))
    } else {
      this.tabs.push(record)
    }
    this.clear(false)
  }

  jumpPage(record: MatchRecord) {
    const pageIndex = this.findPageIndex(record)

    if (pageIndex > -1) {
      this.pages.splice(pageIndex + 1, this.pages.length - pageIndex - 1)
    } else {
      this.pages.push(record)
    }
  }

  pop() {
    this.pages.pop()
  }

  clear(includeTabs = false) {
    if (includeTabs) {
      this.tabs = []
    }
    this.pages = []
  }
}

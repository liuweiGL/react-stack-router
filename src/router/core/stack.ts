import { Noop } from '../utils/function'

import {
  getMatchRecord,
  isSameRoute,
  MatchRecord,
  RecordRaw,
  ResolveRecord,
  RouteRaw
} from './route'

export class Stack {
  private tabs: MatchRecord[] = []
  private pages: MatchRecord[] = []

  // 需要把对 stack 的操作集中到一个事务中来：多次操作只能对外触发一次 change，防止多次渲染
  private actions: Noop[] = []

  constructor(private onTransactionEnd: () => void) {}

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
    return this.items[this.items.length - delta - 1]
  }

  switchTab(record: ResolveRecord) {
    this.actions.push(() => {
      if (this.containsTab(record)) {
        this.tabs.sort(tab => (isSameRoute(tab, record) ? -1 : 0))
      } else {
        this.tabs.push(getMatchRecord(record))
      }
      this.clear(false)
    })
  }

  jumpPage(record: ResolveRecord) {
    this.actions.push(() => {
      const pageIndex = this.findPageIndex(record)

      if (pageIndex > -1) {
        this.pages.splice(pageIndex + 1, this.pages.length - pageIndex - 1)
      } else {
        this.pages.push(getMatchRecord(record))
      }
    })
  }

  pop() {
    this.actions.push(() => {
      this.pages.pop()
    })
  }

  clear(includeTabs = false) {
    this.actions.push(() => {
      if (includeTabs) {
        this.tabs = []
      }
      this.pages = []
    })
  }

  // 提交事务
  startTransaction() {
    this.actions.forEach(action => action())
    this.actions = []
    this.onTransactionEnd()
  }
}

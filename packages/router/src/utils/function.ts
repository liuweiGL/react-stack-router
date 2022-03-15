export type Noop = (...args: any[]) => any

let timer: any
export const debounce = (fn: Noop, wait: number) => {
  if (timer) {
    clearTimeout(timer)
  }

  timer = setTimeout(fn, wait)
}

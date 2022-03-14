export type Noop = (...args: any[]) => any

let timer: number
export const debounce = (fn: Noop, wait: number) => {
  if (timer) {
    clearTimeout(timer)
  }

  timer = setTimeout(fn, wait)
}

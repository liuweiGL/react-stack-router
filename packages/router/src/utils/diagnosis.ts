/**
 * 为变量添加断言
 *
 * 注意：不要使用箭头函数声明
 * @see https://github.com/microsoft/TypeScript/issues/34523
 *  */
export function assert(cond: any, message: string): asserts cond {
  if (!cond) throw new Error(message)
}

export function warning(cond: any, message: string): void {
  if (cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== 'undefined') console.warn(message)

    try {
      // Welcome to debugging React Router!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message)
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

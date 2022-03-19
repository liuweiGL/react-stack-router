import type { DependencyList } from 'react'
import { useRef } from 'react'

import depsAreSame from '../utils/depsAreSame'

export default function useCreation<T>(
  {
    factory,
    unmount
  }: {
    factory: () => T
    unmount?: (t: T) => void
  },
  deps: DependencyList
) {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false
  })
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps
    current.obj = factory()
    if (current.initialized !== false) {
      unmount?.(current.obj)
    }
    current.initialized = true
  }
  return current.obj as T
}

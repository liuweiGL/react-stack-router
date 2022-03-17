import { useLayoutEffect, useRef } from 'react'

import { Noop } from '../utils/function'
import { immediate } from '../utils/immediate'

export const useDidUpdate = (callback: () => void) => {
  const request = useRef<Noop>(() => undefined)

  request.current = immediate(callback)

  useLayoutEffect(() => {
    request.current()
    callback()
  })
}

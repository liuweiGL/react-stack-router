import { useContext, useRef } from 'react'

import { RouteContext } from '../context/RouteContext'
import { RouteStatus } from '../core/route'
import { Noop } from '../utils/function'

export const useDidShow = (cb: Noop<never>) => {
  const { status } = useContext(RouteContext)

  const ref = useRef<RouteStatus>()

  if (status === 'show' && ref.current !== 'show') {
    cb()
  }

  ref.current = status
}

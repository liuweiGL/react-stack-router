import { useContext, useRef } from 'react'

import { RouteContext } from '../context/RouteContext'
import { RouteStatus } from '../core/route'
import { Noop } from '../utils/function'

export const useDidHide = (cb: Noop<never>) => {
  const { status } = useContext(RouteContext)

  const ref = useRef<RouteStatus>()

  if (status === 'hide' && ref.current !== 'hide') {
    cb()
  }

  ref.current = status
}

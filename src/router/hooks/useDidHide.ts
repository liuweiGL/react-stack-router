import { useContext, useRef } from 'react'

import { RouteContext } from '../context/RouteContext'
import { RouteStatus } from '../core/route'
import { Noop } from '../utils/function'

// TODO: fix not working
export const useDidHide = (cb: Noop<never>) => {
  const { status } = useContext(RouteContext)

  const ref = useRef<RouteStatus>()

  // console.log(' ========= useDidHide ========')
  if (status === 'hide' && ref.current !== 'hide') {
    cb()
  }

  ref.current = status
}

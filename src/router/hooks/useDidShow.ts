import { useRef } from 'react'

import { PageStatus } from '../context/PageContext'
import { Noop } from '../utils/function'

import { usePage } from './usePage'

export const useDidShow = (cb: Noop<never>) => {
  const { status } = usePage()

  const ref = useRef<PageStatus>()

  if (status === 'show' && ref.current !== 'show') {
    cb()
  }

  ref.current = status
}

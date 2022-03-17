import { useRef } from 'react'
import { PageStatus } from '../context/PageContext'
import { Noop } from '../utils/function'
import { usePage } from './usePage'

export const useDidHide = (cb: Noop<never>) => {
  const { status } = usePage()

  const ref = useRef<PageStatus>()

  if (status === 'hide' && ref.current !== 'hide') {
    cb()
  }

  ref.current = status
}

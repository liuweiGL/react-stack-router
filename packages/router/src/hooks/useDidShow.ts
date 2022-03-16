import { useRef } from 'react'
import { PageStatus } from 'src/context/PageContext'
import { Noop } from 'src/utils/function'
import { usePage } from './usePage'

export const useDidShow = (cb: Noop<never>) => {
  const { status } = usePage()

  const ref = useRef<PageStatus>()

  if (status === 'show' && ref.current !== 'show') {
    cb()
  }

  ref.current = status
}

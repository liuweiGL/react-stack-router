import { useRef, useState } from 'react'

import { History } from 'history'

import { ProHistory } from '../core/history'
import { Route } from '../core/route'

import { useStack } from './useStack'
import { useUnmount } from './useUnmount'

export type UseHistoryProps = {
  basename: string
  history: History
  routes: Route[]
}

export const useWatch = ({ basename, history, routes }: UseHistoryProps) => {
  const stack = useStack()

  // 不要使用 useMemo 不然有可能导致多个 history 实例操作同一个 stack
  const ref = useRef<ProHistory>()

  if (!ref.current) {
    ref.current = new ProHistory({ basename, history, routes, stack })

    ref.current.listen(({ location }) => {
      setLocation(location)
    })
  }

  const proHistory = ref.current

  const [location, setLocation] = useState(history.location)

  useUnmount(() => {
    proHistory.destroy()
  })

  return {
    location,
    history: proHistory,
    matches: stack.items
  }
}

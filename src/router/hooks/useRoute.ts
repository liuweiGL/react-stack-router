import { useContext } from 'react'

import { RouteContext } from '../context/RouteContext'
import { MatchRecord } from '../core/route'

/**
 * 拆分开来，方便支持泛型
 */
export const useRoute = <T>() => {
  const { current, matches } = useContext(RouteContext)

  return {
    matches,
    current: current as MatchRecord<T>
  }
}

import { useContext } from 'react'

import { RouteContext } from '../context/RouteContext'

/**
 * 拆分开来，方便支持泛型
 */
export const useParams = <T = Record<any, any>>() => {
  const { params } = useContext(RouteContext)

  return params as T
}

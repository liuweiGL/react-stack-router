import { useMemo } from 'react'

import { parseParams } from '../utils/url'

import { useLocation } from './useLocation'

export const useParams = () => {
  const {
    location: { search }
  } = useLocation()

  return useMemo(() => parseParams(search), [search])
}

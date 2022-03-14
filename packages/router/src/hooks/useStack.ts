import { useMemo } from 'react'

import { Stack } from '../core/stack'

import { useForceUpdate } from './useForceUpdate'

export const useStack = () => {
  const scheduler = useForceUpdate()

  return useMemo(() => new Stack(scheduler), [])
}

import { useEffect } from 'react'

export const useUnmount = (cb: () => void) => {
  useEffect(() => {
    return cb
  }, [])
}

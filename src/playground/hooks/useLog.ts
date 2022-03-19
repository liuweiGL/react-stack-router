import { useContext, useRef } from 'react'

import { LogContext } from '../context/LoggerContext'

export const useLog = (show = true) => {
  const { logger, enable } = useContext(LogContext)
  const ref = useRef<typeof console.log>()

  if (!ref.current) {
    ref.current = (...args: string[]) => {
      if (show && enable) logger(...args)
    }
  }

  return ref.current
}

/* eslint-disable no-console */
import { createContext } from 'react'

export const LogContext = createContext<{
  logger: typeof console.log
  enable?: boolean
}>({} as any)

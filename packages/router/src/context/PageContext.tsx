import { createContext } from 'react'

export type PageStatus = 'show' | 'hide'

export type PageContextState = {
  status?: PageStatus
}

export const PageContext = createContext<PageContextState>({})

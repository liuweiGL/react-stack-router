import { createContext } from 'react'

import { ProHistory } from '../core/history'

type NavigationContextState = {
  navigator: ProHistory
}

export const NavigationContext = createContext<NavigationContextState>(
  {} as any
)

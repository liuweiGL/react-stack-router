import { createContext, ProviderProps } from 'react'

import { ProHistory } from '../core/history'

type NavigationContextState = {
  navigator: ProHistory
}

export const NavigationContext = createContext<NavigationContextState>(
  {} as any
)

export const NavigationProvider = (
  props: ProviderProps<NavigationContextState>
) => {
  return <NavigationContext.Provider {...props} />
}

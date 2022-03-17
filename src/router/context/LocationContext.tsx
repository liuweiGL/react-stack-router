import { createContext, PropsWithChildren, ProviderProps } from 'react'

import { Location } from 'history'

type LocationContextState = {
  location: Location
}

export const LocationContext = createContext<LocationContextState>({} as any)

export const LocationProvider = (
  props: ProviderProps<LocationContextState>
) => {
  return <LocationContext.Provider {...props} />
}

import { createContext } from 'react'

import { Location } from 'history'

type LocationContextState = {
  location: Location
}

export const LocationContext = createContext<LocationContextState>({} as any)

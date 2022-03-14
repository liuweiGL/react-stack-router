import { useContext } from 'react'

import { LocationContext } from '../context/LocationContext'

export const useLocation = () => {
  return useContext(LocationContext)
}

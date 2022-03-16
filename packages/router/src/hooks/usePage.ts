import { useContext } from 'react'
import { PageContext } from 'src/context/PageContext'

export const usePage = () => {
  return useContext(PageContext)
}

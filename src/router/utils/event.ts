import { MouseEvent } from 'react'

export const isModifiedEvent = (event: MouseEvent) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

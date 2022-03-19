import { createContext } from 'react'

import { MatchRecord, RouteStatus } from '../core/route'

export type RouteContextState = {
  status: RouteStatus
  params: Record<any, any>
  current: MatchRecord
  matches: MatchRecord[]
}

export const RouteContext = createContext<RouteContextState>({
  params: {},
  matches: []
} as any)

import { useRef } from 'react'

import {
  navigate,
  NavigateBackOptions,
  NavigateForwardOptions
} from '../core/navigate'

import { useNavigation } from './useNavigation'

export type NavigateToParams = Omit<NavigateForwardOptions, 'type'>
export type RedirectToParams = NavigateToParams
export type SwitchTabParams = NavigateToParams
export type NavigateBackParams = Pick<NavigateBackOptions, 'delta'>

export type RouterNavigator = {
  navigateTo: (options: NavigateToParams) => Promise<void>
  redirectTo: (options: RedirectToParams) => Promise<void>
  switchTab: (options: SwitchTabParams) => Promise<void>
  navigateBack: (options: NavigateBackParams) => Promise<void>
}

export const useRouter = () => {
  const { navigator } = useNavigation()

  const ref = useRef<RouterNavigator>()

  if (!ref.current) {
    ref.current = {
      navigateTo: (options: NavigateToParams) => {
        return navigate({ navigator, type: 'navigateTo', ...options })
      },

      redirectTo: (options: RedirectToParams) => {
        return navigate({ navigator, type: 'redirectTo', ...options })
      },

      switchTab: (options: SwitchTabParams) => {
        return navigate({ navigator, type: 'switchTab', ...options })
      },

      navigateBack: (options?: NavigateBackParams) => {
        return navigate({ navigator, type: 'navigateBack', ...options })
      }
    }
  }

  return ref.current as RouterNavigator
}

import { ProHistory } from '../core/history'
import { error } from '../utils/diagnosis'

import { isTabRoute } from './route'

export type NavigateForwardOptions = {
  type: 'navigateTo' | 'switchTab' | 'redirectTo' | 'reLaunch'
  name?: string
  url?: string
}

export type NavigateBackOptions = {
  type: 'navigateBack'
  delta?: number
}

export type NavigateOptions = {
  navigator: ProHistory
} & (NavigateForwardOptions | NavigateBackOptions)

export const navigate = async (options: NavigateOptions) => {
  return new Promise<void>((resolve, reject) => {
    const { navigator, type } = options

    const unListen = navigator.listen(() => {
      resolve()
      unListen()
    })

    try {
      if (type === 'navigateBack') {
        const { delta } = options

        navigator.back(delta)
      } else {
        const { name, url } = options
        const to = name ? { name } : url

        if (!to) {
          return
        }

        if (type === 'navigateTo' || type === 'switchTab') {
          navigator.push(to, ({ route }) => {
            if (type === 'navigateTo' && isTabRoute(route)) {
              error(
                true,
                `Use \`switchTo\` instead of \`navigateTo\` to switch the tabbar page：${route.path}`
              )

              return false
            }
          })
        } else if (type === 'redirectTo') {
          navigator.replace(to)
        } else if (type === 'reLaunch') {
          navigator.reset()
          navigator.push(to)
        }
      }
    } catch (error: any) {
      reject(`${type}:fail ${error.message || error}`)
    }
  })
}

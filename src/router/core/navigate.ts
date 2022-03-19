import { ProHistory, ProTo } from '../core/history'
import { error } from '../utils/diagnosis'

import { isTabRoute } from './route'

export type NavigateForwardOptions = {
  type: 'navigateTo' | 'switchTab' | 'redirectTo'
  name?: string
  url?: string
  params?: Record<any, any>
}

export type NavigateLaunchOptions = Omit<NavigateForwardOptions, 'type'> & {
  type: 'reLaunch'
  // 是否销毁 tab 页面
  force?: boolean
}

export type NavigateBackOptions = {
  type: 'navigateBack'
  delta?: number
}

export type NavigateOptions = {
  navigator: ProHistory
} & (NavigateForwardOptions | NavigateLaunchOptions | NavigateBackOptions)

export const navigate = async (options: NavigateOptions) => {
  return new Promise<void>((resolve, reject) => {
    const { navigator, type } = options

    const unListen = navigator.on(() => {
      resolve()
      unListen()
    })

    try {
      if (type === 'navigateBack') {
        const { delta } = options

        navigator.back(delta)
      } else {
        const { name, url, params } = options
        let to: ProTo | undefined

        if (name) {
          to = { name, params }
        } else if (url) {
          to = { url, params }
        }

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
          navigator.reset(options.force)
          navigator.push(to)
        }
      }
    } catch (error: any) {
      reject(`${type}:fail`)
      console.error(error)
    }
  })
}

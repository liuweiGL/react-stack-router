import { ProHistory } from '../core/history'

export type NavigateForwardOptions = {
  type: 'navigateTo' | 'switchTab' | 'redirectTo'
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
          navigator.push(to)
        } else if (type === 'redirectTo') {
          navigator.reset()
          navigator.push(to)
        }
      }
    } catch (error: any) {
      reject(`${type}:fail ${error.message || error}`)
    }
  })
}

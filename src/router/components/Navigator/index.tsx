import { CSSProperties, MouseEvent, ReactNode } from 'react'

import {
  navigate,
  NavigateBackOptions,
  NavigateForwardOptions,
  NavigateLaunchOptions
} from '../../core/navigate'
import { useNavigation } from '../../hooks/useNavigation'
import { useRoute } from '../../hooks/useRoute'
import { isModifiedEvent } from '../../utils/event'

type ComponentProps = {
  className?: string
  style?: CSSProperties
  title?: ReactNode
  children?: ReactNode
  onClick?: (event: MouseEvent) => boolean | void
}

export type NavigatorProps = ComponentProps &
  (
    | Partial<NavigateForwardOptions>
    | NavigateLaunchOptions
    | NavigateBackOptions
  )

export const Navigator = ({
  className,
  style,
  children,
  title = children,
  onClick,
  ...navigateOptions
}: NavigatorProps) => {
  const { matches } = useRoute()
  const { navigator } = useNavigation()

  let href: string | undefined

  if (navigateOptions.type !== 'navigateBack') {
    const { name, url } = navigateOptions
    const to = name ? { name } : url

    if (to) {
      href = navigator.createHref(to)
    }
  } else {
    const { delta = 1 } = navigateOptions
    const route = matches[Math.max(0, matches.length - delta - 1)]

    href = route ? navigator.createHref(route.url) : '/'
  }

  const handleNavigate = (event: MouseEvent) => {
    const keepGoing = onClick?.(event)

    if (keepGoing === false) {
      event.preventDefault()
      return
    }

    if (event.button === 0 && !isModifiedEvent(event)) {
      event.preventDefault()
      navigate({
        navigator,
        type: 'navigateTo',
        ...navigateOptions
      })
    }
  }

  return (
    <a
      className={className}
      href={href}
      style={style}
      target='_self'
      onClick={handleNavigate}
    >
      {title}
    </a>
  )
}

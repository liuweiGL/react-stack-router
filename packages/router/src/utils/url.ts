import { parsePath, Path } from 'history'

import { PAGE_KEY } from './constants'
import { uid } from './uid'

export const containBasename = (basename: string, pathname: string) => {
  return pathname.toLowerCase().startsWith(basename.toLowerCase())
}

export const stripBasename = (basename: string, pathname: string) => {
  if (basename === '/') return pathname

  if (!containBasename(basename, pathname)) {
    return null
  }

  return pathname.slice(basename.length) || '/'
}

export const joinPaths = (...paths: string[]) => {
  return paths.join('/').replace(/\/\/+/g, '/')
}

export const normalizePath = (pathname: string) => {
  return pathname.replace(/\/+$/, '').replace(/^\/*/, '/')
}

export const parseParams = (url?: string) => {
  const result: Record<string, string> = {}

  if (!url) {
    return result
  }

  const { search } = parsePath(url)
  const searchParams = new URLSearchParams(search)

  for (const [key, value] of searchParams.entries()) {
    result[key] = value
  }

  return result
}

export const stringifyParams = (params: Record<any, any>) => {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, value)
  }

  return searchParams.toString()
}

export const getPageKey = ({ search }: Partial<Path>) => {
  if (!search) {
    return undefined
  }

  const params = parseParams(search)

  const pageKey = params[PAGE_KEY]

  return typeof pageKey === 'string' ? pageKey : undefined
}

export const setPageKey = (location: Partial<Path>) => {
  const params = parseParams(location.search)
  const search = stringifyParams({
    ...params,
    [PAGE_KEY]: uid()
  })

  return {
    ...location,
    search
  }
}

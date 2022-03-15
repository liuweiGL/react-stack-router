import { LazyComponent } from 'src/core/route'

export const isClassComponent = (component: any) => {
  return !!Object.getPrototypeOf(component)?.isReactComponent
}

const importRegexp = /import\s?\(/
export const isLazyComponent = (component: any): component is LazyComponent => {
  if (isClassComponent(component)) {
    return false
  }

  const str = String(component).trim()

  return str.startsWith('(') && str.includes('=>') && importRegexp.test(str)
}

export const loadLazyComponent = async (component: () => Promise<any>) => {
  const res = await component()

  if (res && isESModule(res)) {
    return res.default
  }

  return res
}

export const isESModule = (obj: any): obj is { default: any } => {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

export const hasSymbol =
  typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol'

export {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  createPath
} from 'history'
import { Route } from './core/route'

export {
  Router,
  BrowserRouter,
  HashRouter,
  type RouterProps,
  type BrowserRouterProps,
  type HashRouterProps
} from './components/Router'
export {
  type Route,
  isPageRoute,
  isTabRoute,
  isSameRoute,
  matchRoute
} from './core/route'
export { Navigator, type NavigatorProps } from './components/Navigator'

export { useRouter, type RouterNavigator } from './hooks/useRouter'
export { useLocation } from './hooks/useLocation'
export { useRoute } from './hooks/useRoute'
export { useParams } from './hooks/useParams'
export { useDidHide } from './hooks/useDidHide'
export { useDidShow } from './hooks/useDidShow'

export const defineRoutes = (routes: Route[]) => routes

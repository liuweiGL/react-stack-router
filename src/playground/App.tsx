import { BrowserRouter, Route } from '../router'

import HomePage from './pages/Home'
import ListPage from './pages/List'
import RedirectPage from './pages/Redirect'

const routes: Route[] = [
  {
    name: 'home',
    path: '/',
    component: HomePage,
    meta: {
      title: '首页'
    }
  },
  {
    name: 'list',
    path: '/list',
    component: ListPage,
    meta: {
      title: '列表页'
    }
  },
  {
    name: 'detail',
    path: '/detail',
    component: () => {
      return import('./pages/Detail')
    },
    meta: {
      title: '详情页'
    }
  },
  {
    name: 'redirect',
    path: '/redirect',
    component: RedirectPage,
    meta: {
      title: '重定向'
    }
  }
]

function App() {
  return <BrowserRouter basename='/test' routes={routes} />
}

export default App

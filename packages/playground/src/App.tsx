import { BrowserRouter, Route } from 'react-mobile-router'

import DetailPage from './pages/Detail'
import HomePage from './pages/Home'
import ListPage from './pages/List'

const routes: Route[] = [
  {
    name: 'home',
    path: '/',
    title: '首页',
    component: HomePage
  },
  {
    name: 'list',
    path: '/list',
    title: '列表页',
    component: ListPage
  },
  {
    name: 'detail',
    path: '/detail',
    title: '详情页',
    component: DetailPage
  }
]

function App() {
  return <BrowserRouter basename='/test' routes={routes} />
}

export default App

/* eslint-disable no-console */
import { useState } from 'react'

import { BrowserRouter, Route } from '../router'

import { AppContext } from './context/AppContext'
import { LogContext } from './context/LoggerContext'
import HomePage from './pages/Home'
import LastPage from './pages/Last'
import ListPage from './pages/List'

const routes: Route[] = [
  {
    type: 'tab',
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
    component: LastPage,
    meta: {
      title: '重定向'
    }
  }
]

function App() {
  const [state, setState] = useState({ a: 1 })
  return (
    <LogContext.Provider
      value={{
        enable: false,
        logger: console.log
      }}
    >
      <AppContext.Provider value={{ ...state, setState }}>
        <BrowserRouter basename='/test' routes={routes} />
      </AppContext.Provider>
    </LogContext.Provider>
  )
}

export default App

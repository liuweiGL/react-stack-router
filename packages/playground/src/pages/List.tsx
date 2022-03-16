import { useRouter } from 'react-stack-router'

import { useTraceMount } from '../hooks/useTraceMount'
import { useTraceShow } from '../hooks/useTraceShow'

const ListPage = () => {
  useTraceMount('ListPage')
  useTraceShow('ListPage')
  const { navigateTo } = useRouter()

  return (
    <ul>
      {Array.from({ length: 50 })
        .fill(1)
        .map((item, index) => {
          return (
            <li
              key={index}
              style={{
                padding: '12px',
                textAlign: 'center',
                borderBottom: '1px solid #eee'
              }}
              onClick={() => {
                navigateTo({ name: 'detail' })
              }}
            >
              {index} 点击进入详情页
            </li>
          )
        })}
    </ul>
  )
}

export default ListPage

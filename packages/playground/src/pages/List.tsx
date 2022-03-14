import { useRouter } from 'react-mobile-router'

import { useTracker } from '../hooks/useTracker'

const ListPage = () => {
  useTracker('ListPage')

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
              {index}
            </li>
          )
        })}
    </ul>
  )
}

export default ListPage

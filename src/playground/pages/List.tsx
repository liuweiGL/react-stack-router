import { useLocation, useParams, useRouter } from '../../router'
import { useTraceMount } from '../hooks/useTraceMount'
import { useTraceShow } from '../hooks/useTraceShow'

const ListPage = () => {
  useTraceMount('ListPage')
  useTraceShow('ListPage')
  const { navigateTo } = useRouter()

  const params = useParams()

  console.log(params)

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
                navigateTo({
                  url: '/detail?a=1&b=2',
                  params: { c: 3, d: 'false' }
                })
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

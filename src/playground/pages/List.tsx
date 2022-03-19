import { useRouter } from '../../router'
import { useApp } from '../hooks/useApp'
import { useTraceMount } from '../hooks/useTraceMount'
import { useTraceShow } from '../hooks/useTraceShow'

const ListPage = () => {
  useTraceMount('ListPage')
  useTraceShow('ListPage')

  const { navigateTo } = useRouter()
  const { setState } = useApp()

  console.warn('########## ListPage render #########')

  return (
    <div>
      <button
        onClick={() => {
          setState({ a: Math.random() })
        }}
      >
        测试 freeze 效果，Home 页面不应该打印日志
      </button>
      <ul>
        {Array.from({ length: 20 })
          .fill(1)
          .map((item, index) => {
            return (
              <li
                key={index}
                style={{
                  padding: '20px',
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
    </div>
  )
}

export default ListPage

import { useState } from 'react'

import { useRouter } from '../../router'
import { useTraceMount } from '../hooks/useTraceMount'
import { useTraceShow } from '../hooks/useTraceShow'
import { getRandomColor } from '../uitls/color'

const ListPage = () => {
  useTraceMount('ListPage')
  useTraceShow('ListPage')

  const { navigateTo } = useRouter()
  const [color, setColor] = useState('#333')

  return (
    <div
      className='list-page'
      style={{
        color,
        textAlign: 'center'
      }}
    >
      <br />
      <br />

      <button
        onClick={() => {
          navigateTo({
            url: '/detail?a=1&b=2',
            params: { c: 3, d: 'false' }
          })
        }}
      >
        NavigateTo Detail
      </button>
      <br />
      <br />
      <ul>
        {Array.from({ length: 20 })
          .fill(1)
          .map((item, index) => {
            return (
              <li
                key={index}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #eee'
                }}
                onClick={() => setColor(getRandomColor())}
              >
                {index} Set Random Color
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default ListPage

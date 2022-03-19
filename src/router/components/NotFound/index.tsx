/**
 * Copy from https://github.com/ant-design/ant-design/blob/master/components/result/noFound.tsx
 */

import { useRoute } from '../../hooks/useRoute'
import { Navigator } from '../Navigator'

import NotFoundIcon from './Icon'

const NotFound = () => {
  const { matches } = useRoute()

  return (
    <div
      style={{
        padding: '48px 32px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          marginBottom: '24px'
        }}
      >
        <NotFoundIcon />
      </div>
      <div
        style={{
          color: '#000000d9',
          fontSize: '24px',
          lineHeight: '1.8'
        }}
      >
        404
      </div>
      <div
        style={{
          color: '#00000073',
          fontSize: '14px',
          lineHeight: '1.6'
        }}
      >
        Sorry, the page you visited does not exist.
      </div>
      <div
        style={{
          marginTop: '24px'
        }}
      >
        {matches.length ? (
          <Navigator title='Go Back' type='navigateBack' />
        ) : (
          <Navigator title='Back Home' type='redirectTo' url='/' />
        )}
      </div>
    </div>
  )
}

export default NotFound

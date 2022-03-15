import { Navigator } from 'react-mobile-router'

import { useTracker } from '../hooks/useTracker'

const RedirectPage = () => {
  useTracker('RedirectPage')

  return (
    <div>
      但行好事莫问前程 你和好天气一样惹人心动 听闻远方有你 我跋涉千里
      要把温柔交付给能察觉你小情绪的人
      如果你来访我，我不在，请和我门外的花坐一会儿，它们很温暖。
      沉迷于友情的河里，像个三角互相支持，就像胡万威与涂必金还有吴章平 生于尘埃
      溺于人海 死于理想高台 独自撑伞的日子,也一定要顺顺利利 早餐店不会开到晚上,
      想吃的人早就来了 生活原本沉闷 但跑起来有风
      <br />
      <br />
      <Navigator name='list' title='重定向到列表页' type='redirectTo' />
    </div>
  )
}

export default RedirectPage

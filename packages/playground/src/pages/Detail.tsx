import { Navigator } from 'react-mobile-router'

import { useTracker } from '../hooks/useTracker'

const DetailPage = () => {
  useTracker('DetailPage')

  return (
    <div>
      <article>
        所有不如意的都会烟消云散 知足且上进 温柔而坚定
        我看什么都像你，我看月亮，像你，看星星，也像你。那些白亮透澈、温柔冷清的光，它们都让我想起你。
        抱怨身处黑暗 不如提灯前行
        <br />
        你说是不是月亮碎了就成了星星 爱情小坦克 谁撞谁休克
        顺利的话，你会有一室一厅，养一只柴犬，一只橘猫，和喜欢的人住在一起。
        长大以后难过都要藏起来 行至朝雾里，坠入暮云间。 好好生活 慢慢相遇ᴸⁱᵛᵉ ᵃ
        ᵍᵒᵒᵈ ˡⁱᶠᵉ ᵐᵉᵉᵗ ˢˡᵒʷˡʸ 不求人好感 不予人难堪
      </article>

      <Navigator title='返回首页' type='navigateTo' url='/' />
    </div>
  )
}

export default DetailPage

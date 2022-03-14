import { useMount } from './useMount'
import { useUnmount } from './useUnmount'

const IndexMap = new Map()

export const useTracker = (id: string) => {
  if (!IndexMap.has(id)) {
    IndexMap.set(id, 0)
  }

  useMount(() => {
    IndexMap.set(id, IndexMap.get(id) + 1)
    console.log(
      `================= 第 ${IndexMap.get(id)} 个 ${id} 加载 ================`
    )
  })

  useUnmount(() => {
    console.log(
      `~~~~~~~~~~~~~~~~~ 第 ${IndexMap.get(id)} 个 ${id} 卸载 ~~~~~~~~~~~~~~~~`
    )
    IndexMap.set(id, IndexMap.get(id) - 1)
  })
}

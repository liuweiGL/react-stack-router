/* eslint-disable no-console */
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
      `%c~~~~~~~~~~~~~~ 第 ${IndexMap.get(id)} 个 ${id} 加载 ~~~~~~~~~~~~~~`,
      'color: green'
    )
  })

  useUnmount(() => {
    console.log(
      `%c~~~~~~~~~~~~~~ 第 ${IndexMap.get(id)} 个 ${id} 卸载 ~~~~~~~~~~~~~~`,
      'color: red'
    )
    IndexMap.set(id, IndexMap.get(id) - 1)
  })
}

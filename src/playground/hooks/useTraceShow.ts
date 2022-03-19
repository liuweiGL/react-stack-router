import { useDidHide, useDidShow } from '../../router'

import { useLog } from './useLog'

const IndexMap = new Map()

export const useTraceShow = (id: string) => {
  if (!IndexMap.has(id)) {
    IndexMap.set(id, 0)
  }

  const log = useLog(false)

  useDidShow(() => {
    IndexMap.set(id, IndexMap.get(id) + 1)
    log(
      `%c~~~~~~~~~~~~~~ 第 ${IndexMap.get(id)} 个 ${id} show ~~~~~~~~~~~~~~`,
      'color: #91d5ff'
    )
  })

  useDidHide(() => {
    log(
      `%c~~~~~~~~~~~~~~ 第 ${IndexMap.get(id)} 个 ${id} hide ~~~~~~~~~~~~~~`,
      'color: #ffccc7'
    )
    IndexMap.set(id, IndexMap.get(id) - 1)
  })
}

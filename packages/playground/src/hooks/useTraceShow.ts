/* eslint-disable no-console */
import { useDidHide, useDidShow } from 'react-mobile-router'

const IndexMap = new Map()

export const useTraceShow = (id: string) => {
  if (!IndexMap.has(id)) {
    IndexMap.set(id, 0)
  }

  useDidShow(() => {
    IndexMap.set(id, IndexMap.get(id) + 1)
    console.log(
      `%c~~~~~~~~~~~~~~ 第 ${IndexMap.get(id)} 个 ${id} show ~~~~~~~~~~~~~~`,
      'color: #91d5ff'
    )
  })

  useDidHide(() => {
    console.log(
      `%c~~~~~~~~~~~~~~ 第 ${IndexMap.get(id)} 个 ${id} hide ~~~~~~~~~~~~~~`,
      'color: #ffccc7'
    )
    IndexMap.set(id, IndexMap.get(id) - 1)
  })
}

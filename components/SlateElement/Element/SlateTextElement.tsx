import { observer } from 'mobx-react'
import React from 'react'
import { Range } from 'slate'
import { useSelected, useSlate } from 'slate-react'
import { TextCategory } from '../../../Types/slate/CustomElement'
import EditorManager from '../../../manager/Home/EditorManager'

export const SlateTextElement: React.FC<{
    attributes,
    children,
    element
  }> = observer(({ attributes, children, element }) => {
      const selected = useSelected()
      const editor = useSlate()

      const selection = editor.selection
      const isSelectionCollapsed = selection !== null && Range.isCollapsed(editor.selection)
      const isEmpty = children[0].props.text.text === '' && children.length === 1
      const isHead = [TextCategory.Head1, TextCategory.Head2, TextCategory.Head3].includes(element.category)
      return (
          <p className={ selected && isEmpty && isSelectionCollapsed && !isHead && EditorManager.showPlaceholder
              ? `selected-empty-text text ${element.category}`
              : `text ${element.category}`} {...attributes}>
              {children}
          </p>
      )
  })

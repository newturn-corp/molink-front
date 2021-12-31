import React from 'react'
import { Range } from 'slate'
import { useSelected, useSlate } from 'slate-react'

export const SlateTextElement: React.FC<{
    attributes,
    children,
    element
  }> = ({ attributes, children, element }) => {
      const selected = useSelected()
      const editor = useSlate()

      const selection = editor.selection
      const isSelectionCollapsed = selection !== null && Range.isCollapsed(editor.selection)
      const isEmpty = children[0].props.text.text === '' && children.length === 1
      console.log(isEmpty)
      console.log(selected && isEmpty && isSelectionCollapsed)
      return (
          <p className={ selected && isEmpty && isSelectionCollapsed
              ? `selected-empty-text text ${element.category}`
              : `text ${element.category}`} {...attributes}>
              {children}
          </p>
      )
  }

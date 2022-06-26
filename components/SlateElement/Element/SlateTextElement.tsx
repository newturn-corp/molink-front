import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { Range } from 'slate'
import { useSelected, useSlate } from 'slate-react'
import { TextCategory, TextElement } from '../../../Types/slate/CustomElement'
import { isBrowser } from 'react-device-detect'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
import { Align } from '../../../manager/Editing/FormattingManager'
import { isMac } from 'lib0/environment'

export const SlateTextElement: React.FC<{
    attributes,
    children,
    element: TextElement
  }> = observer(({ attributes, children, element }) => {
      const selected = useSelected()
      const slateEditor = useSlate()

      const editor = EditorPage.editor
      const selection = slateEditor.selection
      const isSelectionCollapsed = selection !== null && Range.isCollapsed(slateEditor.selection)
      const isEmpty = children[0].props.text?.text === '' && children.length === 1
      const showPlaceholder = selected &&
          isEmpty &&
          isSelectionCollapsed &&
          isBrowser &&
          !editor.info.isLocked &&
          editor.showPlaceholder &&
          editor.editable &&
          !(isMac && editor.isComposing)

      const getPlaceholder = useCallback(() => {
          if (element.category === TextCategory.Head1) {
              return '제목1'
          } else if (element.category === TextCategory.Head2) {
              return '제목2'
          } else if (element.category === TextCategory.Head3) {
              return '제목3'
          } else {
              return '/명령어'
          }
      }, [element.category])

      const attrs = {
          style: {
              textAlign: element.align ? element.align : 'left'
          },
          placeholder: getPlaceholder(),
          className: showPlaceholder
              ? `${element.align === Align.Right ? 'selected-empty-text-align-right' : 'selected-empty-text'} text ${element.category}`
              : `text ${element.category}`,
          ...attributes
      }

      return (<>
          {
              element.category === TextCategory.Head1
                  ? <h1 {...attrs}>{children}</h1>
                  : element.category === TextCategory.Head2
                      ? <h2 {...attrs}>{children}</h2>
                      : element.category === TextCategory.Head3
                          ? <h3 {...attrs}>{children}</h3>
                          : <p {...attrs}>{children}</p>
          }
      </>)
  })

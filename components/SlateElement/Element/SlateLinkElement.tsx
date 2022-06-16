import { css } from '@emotion/css'
import React, { useEffect, useRef } from 'react'
import { useSelected, useSlateStatic } from 'slate-react'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { LinkElement } from '../../../Types/slate/CustomElement'
import { Range } from 'slate'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'

const InlineChromiumBugfix = () => (
    <span
        contentEditable={false}
        className={css`
        font-size: 0;
      `}
    >
      ${String.fromCodePoint(160) /* Non-breaking space */}
    </span>
)

export const SlateLinkElement: React.FC<{
    attributes,
    children,
    element: LinkElement
  }> = ({ attributes, children, element }) => {
      const ref = useRef<HTMLAnchorElement>(null)
      const editor = useSlateStatic()
      const selected = useSelected()
      useEffect(() => {
          if (selected && ref && Range.isCollapsed(editor.selection)) {
              EditorPage.editor.linkModifier.open(element, ref)
          } else {
              EditorPage.editor.linkModifier.close()
          }
      }, [selected, ref])

      return (
          <a
              {...attributes}
              ref={ref}
              onClick={() => {
                  RoutingManager.rawMoveTo(element.url)
              }}
              className={'link' + (selected ? ' selected' : '')}
          >
              <InlineChromiumBugfix />
              {children}
              <InlineChromiumBugfix />
          </a>
      )
  }

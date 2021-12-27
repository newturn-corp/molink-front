import { css } from '@emotion/css'
import React from 'react'
import { useSelected } from 'slate-react'
import RoutingManager, { Page } from '../../manager/RoutingManager'
import { LinkElement } from '../../utils/slate'

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
      const selected = useSelected()
      return (
          <a
              {...attributes}
              onClick={() => {
                  RoutingManager.rawMoveTo(element.url)
              }}
              className={
                  selected
                      ? css`
                box-shadow: 0 0 0 3px #ddd;
              `
                      : ''
              }
          >
              <InlineChromiumBugfix />
              {children}
              <InlineChromiumBugfix />
          </a>
      )
  }

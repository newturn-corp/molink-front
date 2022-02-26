import { css } from '@emotion/css'
import React from 'react'
import { useSelected } from 'slate-react'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { LinkElement } from '../../../Types/slate/CustomElement'

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
      return (
          <a
              {...attributes}
              onClick={() => {
                  RoutingManager.rawMoveTo(element.url)
              }}
              className='link'
          >
              <InlineChromiumBugfix />
              {children}
              <InlineChromiumBugfix />
          </a>
      )
  }

import React from 'react'

import { css } from '@emotion/css'
import { CursorComponent } from '../Home/Content/CursorComponent'

export const CustomLeafComponent: React.FC<{
    attributes,
    children,
    leaf
  }> = ({ attributes, children, leaf }) => {
      if (leaf.bold) {
          children = <strong>{children}</strong>
      }

      if (leaf.code) {
          children = <code>{children}</code>
      }

      if (leaf.italic) {
          children = <em>{children}</em>
      }

      if (leaf.underlined) {
          children = <u>{children}</u>
      }

      if (leaf.codehighlight) {
          return <span
              {...attributes}
              className={css`
                font-family: monospace;
    
            ${leaf.comment &&
              css`
                color: slategray;
              `} 
    
            ${(leaf.operator || leaf.url) &&
              css`
                color: #9a6e3a;
              `}
            ${leaf.keyword &&
              css`
                color: #07a;
              `}
            ${(leaf.variable || leaf.regex) &&
              css`
                color: #e90;
              `}
            ${(leaf.number ||
              leaf.boolean ||
              leaf.tag ||
              leaf.constant ||
              leaf.symbol ||
              leaf['attr-name'] ||
              leaf.selector) &&
              css`
                color: #905;
              `}
            ${leaf.punctuation &&
              css`
                color: #999;
              `}
            ${(leaf.string || leaf.char) &&
              css`
                color: #690;
              `}
            ${(leaf.function || leaf['class-name']) &&
              css`
                color: #dd4a68;
              `}
            `}
          >
              {children}
          </span>
      }

      const data = leaf.data as any

      return <span {...attributes}
          style={
          {
              position: 'relative',
              backgroundColor: data?.alphaColor
          } as any
          }>
          {leaf.isCaret ? <CursorComponent {...(leaf as any)} /> : null}
          {children}
      </span>
  }

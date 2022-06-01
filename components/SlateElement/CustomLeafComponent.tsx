import React from 'react'
import { CursorComponent } from '../Home/Main/Content/CursorComponent'
import { CodeHighlightLeaf } from './Leaf/CodeHighlightLeaf'
import { CustomText } from '../../Types/slate/CustomText'

export const CustomLeafComponent: React.FC<{
    attributes,
    children,
    leaf: any
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
          children = <u>
              {children}
          </u>
      }

      if (leaf.codeLanguage) {
          children = <CodeHighlightLeaf
              leaf={leaf}
          >
              {children}
          </CodeHighlightLeaf>
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

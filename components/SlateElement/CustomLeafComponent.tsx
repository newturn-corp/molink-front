import React from 'react'
import { CodeHighlightLeaf } from './Leaf/CodeHighlightLeaf'

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
          {children}
      </span>
  }

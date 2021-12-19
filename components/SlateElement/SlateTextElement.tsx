import React from 'react'
import { Node } from 'slate'
import ContentManager from '../../../manager/home/ContentManager'
import { TextElement } from '../../../utils/slate'

export const SlateTextElement: React.FC<{
    attributes,
    children,
    element: TextElement
  }> = ({ attributes, children, element }) => {
      return (
          <p className={`text-${element.category}`} {...attributes}>
              {children}
          </p>
      )
  }

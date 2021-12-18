import React from 'react'
import { Node } from 'slate'
import ContentManager from '../../../manager/ContentManager'
import { TextElement } from '../../../utils/slate'

export const SlateTextElement: React.FC<{
    attributes,
    children,
    element: TextElement
  }> = ({ attributes, children, element }) => {
      console.log(element.category)
      return (
          <p className={`text-${element.category}`} {...attributes}>
              {children}
          </p>
      )
  }

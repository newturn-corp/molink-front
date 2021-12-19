import React from 'react'
import { Node } from 'slate'
import ContentManager from '../../manager/home/ContentManager'

export const SlateTitleElement: React.FC<{
    attributes,
    children,
    element
  }> = ({ attributes, children, element }) => {
      if (ContentManager.openedDocument) {
          ContentManager.openedDocument.title = Node.string(element)
      }
      return (
          <p className='title' {...attributes}>
              {children}
          </p>
      )
  }

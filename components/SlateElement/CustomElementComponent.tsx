import React from 'react'
import { SlateImageElement } from './SlateImageElement'
import { SlateTextElement } from './SlateTextElement'
import { SlateTitleElement } from './SlateTitleElement'

export const CustomElementComponent: React.FC<{
    attributes,
    children,
    element
  }> = (props) => {
      const { attributes, children, element } = props
      switch (element.type) {
      case 'image':
          return <SlateImageElement { ...props } />
      case 'title':
          return <SlateTitleElement { ...props } />
      case 'text':
          return <SlateTextElement { ...props } />
      default:
          return <p {...attributes}>{children}</p>
      }
  }

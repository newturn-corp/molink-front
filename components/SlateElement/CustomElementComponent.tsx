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
      case 'ul_list':
          return <ul {...attributes}>{children}</ul>
      case 'ol_list':
          return <ol {...attributes}>{children}</ol>
      case 'list_item':
          return <li {...attributes}>{children}</li>
      case 'heading':
          return <h1 {...attributes}>{children}</h1>
      default:
          return <p {...attributes}>{children}</p>
      }
  }

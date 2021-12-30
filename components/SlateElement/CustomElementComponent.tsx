import React from 'react'
import { SlateImageElement } from './SlateImageElement'
import { SlateTextElement } from './SlateTextElement'
import { SlateTitleElement } from './SlateTitleElement'
import { SlateLinkElement } from './SlateLinkElement'

export const CustomElementComponent: React.FC<{
    attributes,
    children,
    element
  }> = (props) => {
      const { attributes, children, element } = props
      console.log(element.type)
      switch (element.type) {
      case 'image':
          return <SlateImageElement { ...props } />
      case 'title':
          return <SlateTitleElement { ...props } />
      case 'text':
          return <SlateTextElement { ...props } />
      case 'ul-list':
          return <ul {...attributes}>{children}</ul>
      case 'ol-list':
          return <ol {...attributes}>{children}</ol>
      case 'list-item':
      case 'ordered-list-item':
          return <li {...attributes}>{children}</li>
      case 'heading':
          return <h1 {...attributes}>{children}</h1>
      case 'block-quote':
          return <blockquote {...attributes}>{children}</blockquote>
      case 'link':
          return <SlateLinkElement {...props} />
      default:
          return <p {...attributes}>{children}</p>
      }
  }

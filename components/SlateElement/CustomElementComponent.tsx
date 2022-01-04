import React from 'react'
import { SlateImageElement } from './SlateImageElement'
import { SlateTextElement } from './SlateTextElement'
import { SlateTitleElement } from './SlateTitleElement'
import { SlateLinkElement } from './SlateLinkElement'
import { SlateDividerElement } from './SlateDividerElement'
import { SlateDocumentElement } from './SlateDocumentElement'
import { SlateCheckListItemElement } from './SlateCheckListItemElement'

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
      case 'ul-list':
          return <ul className='unordered-list' {...attributes}>{children}</ul>
      case 'check-list':
          return <ul className='check-list' {...attributes}>{children}</ul>
      case 'ol-list':
          return <ol {...attributes}>{children}</ol>
      case 'list-item':
      case 'ordered-list-item':
          return <li {...attributes}>{children}</li>
      case 'check-list-item':
          return <SlateCheckListItemElement {...props} />
      case 'heading':
          return <h1 {...attributes}>{children}</h1>
      case 'block-quote':
          return <blockquote {...attributes}>{children}</blockquote>
      case 'link':
          return <SlateLinkElement {...props} />
      case 'divider':
          return <SlateDividerElement { ...props } />
      case 'document':
          return <SlateDocumentElement { ...props } />
      default:
          return <p {...attributes}>{children}</p>
      }
  }

import React from 'react'
import { SlateImageElement } from './Element/SlateImageElement'
import { SlateTextElement } from './Element/SlateTextElement'
import { SlateTitleElement } from './Element/SlateTitleElement'
import { SlateLinkElement } from './Element/SlateLinkElement'
import { SlateDividerElement } from './Element/SlateDividerElement'
import { SlateDocumentElement } from './Element/SlateDocumentElement'
import { SlateCheckListItemElement } from './Element/SlateCheckListItemElement'
import { SlateYoutubeElement } from './Element/SlateYoutubeElement'
import { SlateCodeElement } from './Element/SlateCodeElement'
import { SlateOrderedListElement } from './Element/SlateOrderedListElement'

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
          return <SlateOrderedListElement { ...props }/>
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
      case 'youtube':
          return <SlateYoutubeElement { ...props } />
      case 'code':
          return <SlateCodeElement { ...props } />
      default:
          return <p {...attributes}>{children}</p>
      }
  }

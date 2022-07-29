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
import { SlateVideoElement } from './Element/SlateVideoElement'
import { SlateFileElement } from './Element/SlateFileElement'
import { SlateBookmarkElement } from './Element/Bookmark/SlateBookmarkElement'
import { SlateCalloutElement } from './Element/CalloutElement'
import { SlateTempBookmarkElement } from './Element/Bookmark/SlateTempBookmarkElement'
import { SlateUnorderedListItemElement } from './Element/SlateUnorderedListItemElement'
import { SlateUnorderedListElement } from './Element/SlateUnorderedListElement'
import { SlateOrderedListItemElement } from './Element/SlateOrderedListItemElement'

export const CustomElementComponent: React.FC<{
    attributes,
    children,
    element
  }> = (props) => {
      const { attributes, children, element } = props
      switch (element.type) {
      case 'image':
          return <SlateImageElement { ...props } />
      case 'video':
          return <SlateVideoElement { ...props } />
      case 'file':
          return <SlateFileElement { ...props } />
      case 'temp-bookmark':
          return <SlateTempBookmarkElement { ...props } />
      case 'bookmark':
          return <SlateBookmarkElement { ...props } />
      case 'title':
          return <SlateTitleElement { ...props } />
      case 'text':
          return <SlateTextElement { ...props } />
      case 'ul-list':
          return <SlateUnorderedListElement { ...props } />
      case 'check-list':
          return <ul className='check-list' {...attributes}>{children}</ul>
      case 'ol-list':
          return <SlateOrderedListElement { ...props }/>
      case 'list-item':
          return <SlateUnorderedListItemElement { ...props }/>
      case 'ordered-list-item':
          return <SlateOrderedListItemElement { ...props }/>
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
      case 'callout':
          return <SlateCalloutElement { ...props } />
      default:
          return <p {...attributes}>{children}</p>
      }
  }

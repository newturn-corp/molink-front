import React from 'react'
import { observer } from 'mobx-react'
import { css } from '@emotion/css'
import { SlateImageElement } from './global/SlateElement/SlateImageElement'
import { SlateTitleElement } from './global/SlateElement/SlateTitleElement'

export const BlockComponent: React.FC<{
    attributes,
    children,
    element
  }> = observer((props) => {
      const { attributes, children, element } = props
      switch (element.type) {
      case 'image':
          return <SlateImageElement { ...props } />
      case 'title':
          return <SlateTitleElement { ...props } />
      case 'block-quote':
          return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
          return <ul {...attributes}>{children}</ul>
      case 'heading-one':
          return <h1 {...attributes}>{children}</h1>
      case 'heading-three':
          return <h3 {...attributes}>{children}</h3>
      case 'heading-four':
          return <h4 {...attributes}>{children}</h4>
      case 'heading-five':
          return <h5 {...attributes}>{children}</h5>
      case 'heading-six':
          return <h6 {...attributes}>{children}</h6>
      case 'list-item':
          return <li {...attributes}>{children}</li>
      case 'code':
          return <p
              className='code'
              spellCheck='false'
              {...attributes}>
              {children}
          </p>
      default:
          return <p {...attributes}>{children}</p>
      }
  })

export const BlockNoLeafComponent: React.FC<{
    attributes,
    children,
    leaf
  }> = observer(({ attributes, children, leaf }) => {
      if (leaf.bold) {
          children = <strong>{children}</strong>
      }

      if (leaf.code) {
          children = <code>{children}</code>
      }

      if (leaf.italic) {
          children = <em>{children}</em>
      }

      if (leaf.underline) {
          children = <u>{children}</u>
      }

      if (leaf.codehighlight) {
          return <span
              {...attributes}
              className={css`
                font-family: monospace;
    
            ${leaf.comment &&
              css`
                color: slategray;
              `} 
    
            ${(leaf.operator || leaf.url) &&
              css`
                color: #9a6e3a;
              `}
            ${leaf.keyword &&
              css`
                color: #07a;
              `}
            ${(leaf.variable || leaf.regex) &&
              css`
                color: #e90;
              `}
            ${(leaf.number ||
              leaf.boolean ||
              leaf.tag ||
              leaf.constant ||
              leaf.symbol ||
              leaf['attr-name'] ||
              leaf.selector) &&
              css`
                color: #905;
              `}
            ${leaf.punctuation &&
              css`
                color: #999;
              `}
            ${(leaf.string || leaf.char) &&
              css`
                color: #690;
              `}
            ${(leaf.function || leaf['class-name']) &&
              css`
                color: #dd4a68;
              `}
            `}
          >
              {children}
          </span>
      }

      return <span {...attributes}>{children}</span>
  })

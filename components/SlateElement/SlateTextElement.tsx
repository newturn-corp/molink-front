import React from 'react'

export const SlateTextElement: React.FC<{
    attributes,
    children,
    element
  }> = ({ attributes, children, element }) => {
      return (
          <p className={`text ${element.category}`} {...attributes}>
              {children}
          </p>
      )
  }

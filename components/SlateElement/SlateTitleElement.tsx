import React from 'react'

export const SlateTitleElement: React.FC<{
    attributes,
    children,
    element
  }> = ({ attributes, children, element }) => {
      // useEffect(() => {
      //     ContentManager.updateTitle(Node.string(element))
      // })
      return (
          <p className='title' {...attributes}>
              {children}
          </p>
      )
  }

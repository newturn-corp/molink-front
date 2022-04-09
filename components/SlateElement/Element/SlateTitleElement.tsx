import React from 'react'
import { isBrowser } from 'react-device-detect'

export const SlateTitleElement: React.FC<{
    attributes,
    children,
    element
  }> = ({ attributes, children, element }) => {
      // useEffect(() => {
      //     ContentManager.updateTitle(Node.string(element))
      // })
      return (
          <p
              className='title'
              style={{
                  fontSize: isBrowser ? 40 : 32
              }}
              {...attributes}
          >
              {children}
          </p>
      )
  }

import React from 'react'
import { observer } from 'mobx-react'
import Text from '../domain/Text'
import { getTextStyleByDepth } from '../infra/font'

export const TextLine: React.FC<{
    text: Text
  }> = observer(({ text }) => {
      return (
          <p className={'text-line'} style={getTextStyleByDepth(text.depth)} >
              {text.title}
          </p>
      )
  })

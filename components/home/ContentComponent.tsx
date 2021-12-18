import { observer } from 'mobx-react'
import '../../utils/prism'
import React from 'react'
import { Editor } from './Editor'
import { ContentHeaderIcon } from './ContentHeaderIcon'

export const ContentComponent: React.FC<{
  }> = observer(() => {
      return <div className={'contents'}>
          <ContentHeaderIcon/>
          <Editor/>
      </div>
  })

import { observer } from 'mobx-react'
import '../../utils/prism'
import React from 'react'
import { Editor } from './Editor'
import { ContentHeaderIcon } from './ContentHeaderIcon'
import { ContentForEmptyDocument } from './ContentForEmptyDocument'

export const ContentComponent: React.FC<{
  }> = observer(() => {
      return <div className={'contents'}>
          <ContentForEmptyDocument />
          <ContentHeaderIcon/>
          <Editor/>
      </div>
  })

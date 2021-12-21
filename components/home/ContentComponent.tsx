import { observer } from 'mobx-react'
import '../../utils/prism'
import React from 'react'
import { Editor } from './Editor'
import { PureEditor } from '../index/PureEditor'

export const ContentComponent: React.FC<{
  }> = observer(() => {
      return <div className={'contents'}>
          {/* <ContentForEmptyDocument />
          <ContentHeaderIcon/> */}
          <PureEditor/>
      </div>
  })

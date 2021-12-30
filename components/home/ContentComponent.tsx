import { observer } from 'mobx-react'
import '../../utils/prism'
import React from 'react'
import { PureEditor } from '../index/PureEditor'
import { ContentForEmptyDocument } from './ContentForEmptyDocument'
import { ContentHeaderIcon } from './ContentHeaderIcon'

export const ContentComponent: React.FC<{
  }> = observer(() => {
      return <div className={'contents'}>
          <ContentForEmptyDocument />
          <ContentHeaderIcon/>
          <PureEditor/>
          <div className='content-footer'></div>
      </div>
  })

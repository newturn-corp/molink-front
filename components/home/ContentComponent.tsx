import { observer } from 'mobx-react'
import '../../utils/prism'
import React from 'react'
import { PureEditor } from '../index/PureEditor'
import { ContentForEmptyDocument } from './ContentForEmptyDocument'
import { ContentHeaderIcon } from './ContentHeaderIcon'
import StyleManager from '../../manager/StyleManager'

export const ContentComponent: React.FC<{
  }> = observer(() => {
      return <div className={'content-container'} style={StyleManager.contentStyle.container}>
          <div className={'contents'}
              style={StyleManager.contentStyle.content}>
              <ContentForEmptyDocument />
              <ContentHeaderIcon/>
              <PureEditor/>
              <div className='content-footer'></div>
          </div>
      </div>
  })

import { observer } from 'mobx-react'
import React from 'react'
import StyleManager from '../../../manager/global/StyleManager'
import { ContentHeader } from './Header/ContentHeader'
import { ContentComponent } from './Content/ContentComponent'

export const HomeMainComponent: React.FC<{
  }> = observer(() => {
      return <div className={'content-container'} style={StyleManager.contentStyle.container}>
          <ContentHeader/>
          <ContentComponent/>
      </div>
  })

import { observer } from 'mobx-react'
import '../../utils/prism'
import React from 'react'
import ContentManager from '../../manager/ContentManager'
import { Button } from '@material-ui/core'

export const ContentHeaderIcon: React.FC<{
  }> = observer(() => {
      if (!ContentManager.openedDocument) {
          return <></>
      }
      return <Button className={'icon'} >
          {ContentManager.openedDocument.icon}
      </Button>
  })

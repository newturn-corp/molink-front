import { observer } from 'mobx-react'
import '../../utils/prism'
import React, { useCallback, useMemo } from 'react'
import ContentManager from '../../manager/ContentManager'
import { Editor } from './Editor'
import { Button } from '@material-ui/core'

export const ContentComponent: React.FC<{
  }> = observer(() => {
      if (!ContentManager.openedDocument) {
          return <></>
      }
      return <div className={'contents'}>
          <Button className={'icon'} >
              {ContentManager.openedDocument.icon}
          </Button>
          <Editor/>
      </div>
  })

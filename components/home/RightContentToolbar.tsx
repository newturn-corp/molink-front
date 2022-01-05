import { IconButton } from '@material-ui/core'
import { LockOpenOutlined, LockOutlined } from '@material-ui/icons'
import { observer } from 'mobx-react'
import React from 'react'
import Document from '../../domain/Document'
import ContentManager from '../../manager/ContentManager'
import { LockButton } from './LockButton'

export const RightContentToolbar: React.FC<{
  }> = observer(() => {
      return <div className={'right-content-toolbar'}>
          <LockButton/>
      </div>
  })

import { IconButton } from '@material-ui/core'
import { LockOpenOutlined, LockOutlined } from '@material-ui/icons'
import { observer } from 'mobx-react'
import React from 'react'
import ContentManager from '../../manager/ContentManager'

export const LockButton: React.FC<{
  }> = observer(() => {
      return <div
          className='lock-button'
          onClick={() => {
              ContentManager.openedDocument.updateIsLocked(!ContentManager.openedDocument.isLocked)
          }}
      >
          {
              ContentManager.openedDocument.isLocked
                  ? <LockOutlined/>
                  : <LockOpenOutlined/>
          }
          <p className='lock-text'>
              {
                  ContentManager.openedDocument.isLocked
                      ? '잠금됨'
                      : '잠금 해제 상태'
              }
          </p>
      </div>
  })

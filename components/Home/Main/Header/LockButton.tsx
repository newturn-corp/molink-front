import { observer } from 'mobx-react'
import React from 'react'
import EditorManager from '../../../../manager/Home/EditorManager'
import { LockOpenOutlined, LockOutlined } from '@material-ui/icons'

export const LockButton: React.FC<{
  }> = observer(() => {
      return <div
          className='lock-button'
          onClick={() => {
              EditorManager.updateIsLocked(!EditorManager.isLocked)
          }}
      >
          {
              EditorManager.isLocked
                  ? <img className='icon' src={'/image/editor/lock-button.svg'}/>
                  : <img className='icon' src={'/image/editor/unlock-button.svg'}/>
          }
          <p className='lock-text'>
              {
                  EditorManager.isLocked
                      ? '잠금'
                      : '잠금 해제'
              }
          </p>
      </div>
  })

import { observer } from 'mobx-react'
import React from 'react'
import { ContentHeaderSettingButton } from './ContentHeaderSettingButton'
import EditorManager from '../../../../manager/Blog/EditorManager'

export const LockButton: React.FC<{
  }> = observer(() => {
      return <ContentHeaderSettingButton
          onClick={() => {
              EditorManager.updateIsLocked(!EditorManager.isLocked)
          }}
          iconSrc={
              EditorManager.isLocked
                  ? '/image/editor/lock-button.svg'
                  : '/image/editor/unlock-button.svg'}
          text={
              EditorManager.isLocked
                  ? '잠금'
                  : '작성'
          }
      />
  })

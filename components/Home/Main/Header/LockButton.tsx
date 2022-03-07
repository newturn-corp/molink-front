import { observer } from 'mobx-react'
import React from 'react'
import { ContentSettingButton } from './ContentSettingButton'
import EditorManager from '../../../../manager/Blog/EditorManager'
import LockIcon from '../../../Icon/LockIcon'

export const LockButton: React.FC<{
  }> = observer(() => {
      return <ContentSettingButton
          active={EditorManager.editable}
          tooltip={EditorManager.isLocked ? '잠겨짐' : '잠금하기'}
          onClick={() => {
              EditorManager.updateIsLocked(!EditorManager.isLocked)
          }}
          icon={
              <LockIcon
                  fill={EditorManager.isLocked ? '#000000' : '#ABB3BB'}
              />
          }
      />
  })

import { observer } from 'mobx-react'
import React from 'react'
import { ContentSettingButton } from './ContentSettingButton'
import EditorManager from '../../../../manager/Blog/EditorManager'
import LockIcon from '../../../Icon/LockIcon'
import LanguageManager from '../../../../manager/global/LanguageManager'

export const LockButton: React.FC<{
  }> = observer(() => {
      return <ContentSettingButton
          active={EditorManager.editable}
          tooltip={EditorManager.isLocked ? LanguageManager.languageMap.Locked : LanguageManager.languageMap.Lock}
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

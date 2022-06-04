import { observer } from 'mobx-react'
import React from 'react'
import { ContentSettingButton } from './ContentSettingButton'
import LockIcon from '../../../Icon/LockIcon'
import LanguageManager from '../../../../manager/global/LanguageManager'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'

export const LockButton: React.FC<{
  }> = observer(() => {
      const editor = EditorPage.editor
      const isLocked = editor.info.isLocked
      const tooltipText = isLocked ? LanguageManager.languageMap.Locked : LanguageManager.languageMap.Lock
      const buttonColor = isLocked ? '#000000' : '#ABB3BB'

      return <ContentSettingButton
          active={editor.editable}
          tooltip={tooltipText}
          onClick={() => {
              editor.info.updateIsLocked(!isLocked)
          }}
          icon={
              <LockIcon
                  fill={buttonColor}
              />
          }
      />
  })

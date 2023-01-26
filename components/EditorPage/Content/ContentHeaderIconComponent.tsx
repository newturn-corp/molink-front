import { observer } from 'mobx-react'
import React, { useCallback, useRef } from 'react'
import { Button } from '@material-ui/core'
import { EmojiClickData } from 'emoji-picker-react'
import EmojiPicker from '../../../manager/global/EmojiPicker'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../manager/global/Blog/Blog'

export const ContentHeaderIconComponent: React.FC<{
  }> = observer(() => {
      const iconRef = useRef(null)
      const editorInfo = EditorPage.editor.info

      const onEmojiClick = useCallback((data: EmojiClickData) => {
          editorInfo.updateHeaderIcon(data.emoji)
          EmojiPicker.close()
      }, [iconRef])

      return <>
          <Button
              ref={iconRef}
              className={'header-icon'}
              disabled={!EditorPage.editor.editable}
              onClick={(event) => {
                  event.stopPropagation()
                  const rect = iconRef.current.getBoundingClientRect()
                  const position = {
                      top: rect.top + (rect.height / 2),
                      left: rect.left + (rect.width / 2)
                  }
                  EmojiPicker.open(position, onEmojiClick)
              }}
          >
              {editorInfo.icon}
          </Button>
      </>
  })

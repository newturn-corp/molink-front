import { observer } from 'mobx-react'
import React, { useCallback, useRef } from 'react'
import { Button } from '@material-ui/core'
import { IEmojiData } from 'emoji-picker-react'
import EmojiPicker from '../../../../manager/global/EmojiPicker'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../../manager/global/Blog/Blog'

export const ContentHeaderIcon: React.FC<{
  }> = observer(() => {
      const iconRef = useRef(null)
      const openedPage = Blog.pageHierarchy.openedPage

      const onEmojiClick = useCallback((event, emojiObject: IEmojiData) => {
          openedPage.handleEmojiClick(emojiObject.emoji)
          EmojiPicker.close()
      }, [iconRef])

      // if (!Blog.pageHierarchy.headerIconActive) {
      //     return <></>
      // }

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
              {openedPage.icon}
          </Button>
      </>
  })

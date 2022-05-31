import { observer } from 'mobx-react'
import React, { useCallback, useRef } from 'react'
import { Button } from '@material-ui/core'
import { IEmojiData } from 'emoji-picker-react'
import EditorManager from '../../../../manager/Blog/EditorManager'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EmojiPicker from '../../../../manager/global/EmojiPicker'

export const ContentHeaderIcon: React.FC<{
  }> = observer(() => {
      const iconRef = useRef(null)
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      const page = currentHierarchy.map[currentHierarchy.openedPageId]
      const onEmojiClick = useCallback((event, emojiObject: IEmojiData) => {
          const page = currentHierarchy.yMap.get(currentHierarchy.openedPageId)
          if (page.icon !== emojiObject.emoji) {
              page.icon = emojiObject.emoji
              currentHierarchy.yMap.set(page.id, page)
          }
      }, [iconRef])

      return <>
          <Button
              ref={iconRef}
              className={'header-icon'}
              disabled={!EditorManager.editable}
              onClick={(event) => {
                  event.stopPropagation()
                  const rect = iconRef.current.getBoundingClientRect()
                  const position = {
                      top: rect.top + (rect.height / 2),
                      left: rect.left + (rect.width / 2)
                  }
                  EmojiPicker.open(position, onEmojiClick)
              }}>
              {page.icon}
          </Button>
      </>
  })

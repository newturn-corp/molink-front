import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { EmojiPicker } from '../../../global/EmojiPicker'
import { IEmojiData } from 'emoji-picker-react'
import EditorManager from '../../../../manager/Blog/EditorManager'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'

export const ContentHeaderIcon: React.FC<{
  }> = observer(() => {
      const [showEmojiPicker, setShowEmojiPicker] = useState(false)

      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      const page = currentHierarchy.map[currentHierarchy.openedPageId]
      const onEmojiClick = (emojiObject: IEmojiData) => {
          const document = currentHierarchy.yMap.get(currentHierarchy.openedPageId)
          if (document.icon !== emojiObject.emoji) {
              document.icon = emojiObject.emoji
              currentHierarchy.yMap.set(document.id, document)
          }
          setShowEmojiPicker(false)
      }

      return <>
          <Button
              className={'header-icon'}
              disabled={!EditorManager.editable}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              {page.icon}
          </Button>
          <EmojiPicker showEmojiPicker={showEmojiPicker} onEmojiPick={(event, emojiObject) => onEmojiClick(emojiObject)}></EmojiPicker>
      </>
  })

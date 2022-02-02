import { observer } from 'mobx-react'
import { IEmojiData } from 'emoji-picker-react'
import React, { useState } from 'react'
import ContentManager from '../../manager/ContentManager'
import { Button } from '@material-ui/core'
import EventManager from '../../manager/EventManager'
import UserManager from '../../manager/global/UserManager'
import { EmojiPicker } from '../../../global/EmojiPicker'
import HierarchyManager from '../../../../manager/Home/Hierarchy/HierarchyManager'

export const ContentHeaderIcon: React.FC<{
  }> = observer(() => {
      const [showEmojiPicker, setShowEmojiPicker] = useState(false)
      const document = HierarchyManager.hierarchy.map[HierarchyManager.hierarchy.openedDocumentId]
      const onEmojiClick = (emojiObject: IEmojiData) => {
          EventManager.issueChangeDocumentIcon(ContentManager.openedDocument, emojiObject.emoji)
          if (ContentManager.openedDocument.meta.icon !== emojiObject.emoji) {
              ContentManager.openedDocument.meta.setDocumentIcon(emojiObject.emoji)
          }
          setShowEmojiPicker(false)
      }

      return <><Button className={'icon'} disabled={!ContentManager.openedDocument.authority.editable} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          {ContentManager.openedDocument.meta.icon}
      </Button>
      <EmojiPicker showEmojiPicker={showEmojiPicker} onEmojiPick={(event, emojiObject) => onEmojiClick(emojiObject)}></EmojiPicker>
      </>
  })

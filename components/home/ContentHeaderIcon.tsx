import { observer } from 'mobx-react'
import { IEmojiData } from 'emoji-picker-react'
import '../../utils/prism'
import React, { useState } from 'react'
import ContentManager from '../../manager/ContentManager'
import { Button } from '@material-ui/core'
import { EmojiPicker } from '../global/EmojiPicker'
import EventManager from '../../manager/EventManager'
import UserManager from '../../manager/global/UserManager'

export const ContentHeaderIcon: React.FC<{
  }> = observer(() => {
      const [showEmojiPicker, setShowEmojiPicker] = useState(false)

      const onEmojiClick = (emojiObject: IEmojiData) => {
          EventManager.issueChangeDocumentIcon(ContentManager.openedDocument, emojiObject.emoji)
          if (ContentManager.openedDocument.meta.icon !== emojiObject.emoji) {
              ContentManager.openedDocument.meta.setDocumentIcon(emojiObject.emoji)
          }
          setShowEmojiPicker(false)
      }

      if (!ContentManager.openedDocument) {
          return <></>
      }
      return <><Button className={'icon'} disabled={!ContentManager.openedDocument.authority.editable} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          {ContentManager.openedDocument.meta.icon}
      </Button>
      <EmojiPicker showEmojiPicker={showEmojiPicker} onEmojiPick={(event, emojiObject) => onEmojiClick(emojiObject)}></EmojiPicker>
      </>
  })

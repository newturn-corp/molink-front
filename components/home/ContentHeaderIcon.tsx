import { observer } from 'mobx-react'
import dynamic from 'next/dynamic'
import { IEmojiPickerProps, IEmojiData } from 'emoji-picker-react'
import '../../utils/prism'
import React, { useState } from 'react'
import ContentManager from '../../manager/home/ContentManager'
import { Button } from '@material-ui/core'
import { EmojiPicker } from '../global/EmojiPicker'
import EventManager from '../../manager/home/EventManager'

export const ContentHeaderIcon: React.FC<{
  }> = observer(() => {
      const [showEmojiPicker, setShowEmojiPicker] = useState(false)

      const onEmojiClick = (event, emojiObject: IEmojiData) => {
          EventManager.issueChangeDocumentIcon(ContentManager.openedDocument, emojiObject.emoji)
          setShowEmojiPicker(false)
      }

      if (!ContentManager.openedDocument) {
          return <></>
      }
      return <><Button className={'icon'} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          {ContentManager.openedDocument.icon}
      </Button>
      <EmojiPicker showEmojiPicker={showEmojiPicker} onEmojiPick={(event, emojiObject) => onEmojiClick(event, emojiObject)}></EmojiPicker>
      </>
  })

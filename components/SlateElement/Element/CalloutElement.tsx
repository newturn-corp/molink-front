import React, { useCallback, useState } from 'react'
import { Button } from '@material-ui/core'
import EditorManager from '../../../manager/Blog/EditorManager'
import { EmojiPicker } from '../../global/EmojiPicker'
import { IEmojiData } from 'emoji-picker-react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

export const SlateCalloutElement: React.FC<{
    attributes,
    children,
    element
}> = ({
    attributes,
    children,
    element
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const currentNodePath = useCallback(() => (
        ReactEditor.findPath(EditorManager.slateEditor, element)
    ), [EditorManager.slateEditor, element])

    const onEmojiClick = (emojiObject: IEmojiData) => {
        Transforms.setNodes(EditorManager.slateEditor, {
            icon: emojiObject.emoji
        }, {
            at: currentNodePath()
        })
        setShowEmojiPicker(false)
    }

    return (
        <div
            className='callout'
            spellCheck='false'
            {...attributes}>
            <div
                className={'emoji'}
                contentEditable={false }
                onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setShowEmojiPicker(!showEmojiPicker)
                }}
            >
                {element.icon}
            </div>
            <EmojiPicker
                showEmojiPicker={showEmojiPicker}
                onEmojiPick={(event, emojiObject) => onEmojiClick(emojiObject)}
                disableSearchBar={true}
            />
            {children}
        </div>
    )
}

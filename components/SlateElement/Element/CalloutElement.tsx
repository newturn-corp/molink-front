import React, { useCallback, useRef } from 'react'
import { IEmojiData } from 'emoji-picker-react'
import { Transforms } from 'slate'
import { ReactEditor, useSlateStatic } from 'slate-react'
import EmojiPicker from '../../../manager/global/EmojiPicker'

export const SlateCalloutElement: React.FC<{
    attributes,
    children,
    element
}> = ({
    attributes,
    children,
    element
}) => {
    const editor = useSlateStatic()
    const iconRef = useRef(null)

    const getCurrentNodePath = useCallback(() => (
        ReactEditor.findPath(editor, element)
    ), [editor, element])

    const onEmojiClick = useCallback((event, emojiObject: IEmojiData) => {
        Transforms.setNodes(editor, {
            icon: emojiObject.emoji
        }, {
            at: getCurrentNodePath()
        })
    }, [getCurrentNodePath])

    return (
        <div
            className='callout'
            spellCheck='false'
            {...attributes}>
            <div
                ref={iconRef}
                className={'emoji'}
                contentEditable={false}
                onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    const rect = iconRef.current.getBoundingClientRect()
                    const position = {
                        top: rect.top + (rect.height / 2),
                        left: rect.left + (rect.width / 2)
                    }
                    EmojiPicker.open(position, onEmojiClick)
                }}
            >
                {element.icon}
            </div>
            {children}
        </div>
    )
}

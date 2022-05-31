import React, { useCallback, useRef, useState } from 'react'
import { Button } from '@material-ui/core'
import EditorManager from '../../../manager/Blog/EditorManager'
import { EmojiPickerComponent } from '../../global/EmojiPickerComponent'
import { IEmojiData } from 'emoji-picker-react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
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
    const iconRef = useRef(null)
    const currentNodePath = useCallback(() => (
        ReactEditor.findPath(EditorManager.slateEditor, element)
    ), [EditorManager.slateEditor, element])

    const onEmojiClick = useCallback((event, emojiObject: IEmojiData) => {
        Transforms.setNodes(EditorManager.slateEditor, {
            icon: emojiObject.emoji
        }, {
            at: currentNodePath()
        })
    }, [currentNodePath])

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

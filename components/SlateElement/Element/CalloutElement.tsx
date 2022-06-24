import React, { useCallback, useRef, useState } from 'react'
import { IEmojiData } from 'emoji-picker-react'
import { Transforms } from 'slate'
import { ReactEditor, useSlateStatic } from 'slate-react'
import EmojiPicker from '../../../manager/global/EmojiPicker'
import { MediaMenuButton } from '../Extra/MediaMenuButton'
import MenuItem from '../../../manager/global/Menu/MenuItem'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'

export const SlateCalloutElement: React.FC<{
    attributes,
    children,
    element
}> = ({
    attributes,
    children,
    element
}) => {
    const editor = EditorPage.editor
    const editable = editor.editable
    const slateEditor = useSlateStatic()
    const iconRef = useRef(null)
    const [isMouseOver, setIsMouseOver] = useState(false)
    const getCurrentNodePath = useCallback(() => (
        ReactEditor.findPath(slateEditor, element)
    ), [slateEditor, element])

    const onEmojiClick = useCallback((event, emojiObject: IEmojiData) => {
        Transforms.setNodes(slateEditor, {
            icon: emojiObject.emoji
        }, {
            at: getCurrentNodePath()
        })
        EmojiPicker.close()
    }, [getCurrentNodePath])

    return (
        <div
            className='callout'
            onMouseOver={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}
            {...attributes}
        >
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
            <div
                className={'callout-content'}
            >
                {children}
            </div>
            {
                editable && <MediaMenuButton
                    isShow={isMouseOver}
                    menuItems={[new MenuItem('삭제', () => {
                        if (editable) {
                            Transforms.removeNodes(slateEditor, { at: getCurrentNodePath() })
                        }
                    })]}
                    currentNodePath={getCurrentNodePath()}
                />
            }
        </div>
    )
}

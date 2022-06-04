import React, { useRef, useState } from 'react'
import { FloatOption, TextCategory } from '../../../Types/slate/CustomElement'
import TextArea, { TextAreaRef } from 'antd/lib/input/TextArea'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { Editor, Transforms } from 'slate'

export const Caption: React.FC<{
    selected: boolean,
    caption: string,
    floatOption: FloatOption
}> = ({ selected, caption, floatOption }) => {
    const inputRef = useRef<TextAreaRef>(null)
    const [captionFocused, setCaptionFocused] = useState(false)
    const editor = useSlateStatic()
    if (!selected || !caption) {
        if (captionFocused) {
            setCaptionFocused(false)
        }
    }
    const showCaption = selected || (caption && caption.length > 0)
    return <figcaption style={{
        display: showCaption ? undefined : 'none'
    }}>
        <TextArea
            ref={inputRef}
            className={'caption'}
            style={{
                userSelect: captionFocused ? 'auto' : undefined,
                textAlign: floatOption === FloatOption.Left ? 'left' : floatOption === FloatOption.Center ? 'center' : 'right'
            }}
            tabIndex={-1}
            onClick={() => {
                setCaptionFocused(true)
            }}
            autoSize={true}
            placeholder='설명'
            bordered={false}
            defaultValue={caption}
            //   readOnly={!captionFocused}
            rows={1}
            onChange={(e) => {
                Transforms.setNodes(editor, {
                    caption: e.target.value
                }, {
                    at: editor.selection
                })
            }}
            onBlur={(e) => {
                setCaptionFocused(false)
            }}
            onKeyDown={(e) => {
                if (e.ctrlKey) {
                    e.preventDefault()
                }
                if (e.key === 'ArrowDown') {
                    setCaptionFocused(false)
                    const { selection } = editor
                    if (selection.anchor.path[0] === editor.children.length - 1) {
                        Transforms.insertNodes(editor, {
                            type: 'text',
                            category: TextCategory.Content3,
                            children: [{ text: '' }]
                        })
                    }
                    inputRef.current.blur()
                    ReactEditor.focus(editor)
                    Transforms.select(editor, Editor.after(editor, editor.selection, { unit: 'line' }))
                } else if (e.key === 'ArrowUp') {
                    setCaptionFocused(false)
                    inputRef.current.blur()
                    ReactEditor.focus(editor)
                    Transforms.select(editor, Editor.before(editor, editor.selection, {
                        distance: 1
                    }))
                }
            }}
        />
    </figcaption>
}

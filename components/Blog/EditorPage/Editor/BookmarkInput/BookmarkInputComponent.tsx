import React, { ChangeEvent, useEffect, useRef } from 'react'
import { Editor, Range } from 'slate'
import { useSlate } from 'slate-react'
import LinkManager from '../../../../../manager/Editing/Link/LinkManager'
import { Portal } from '../../../../utils/Portal'
import EditorPage from '../../../../../manager/Blog/Editor/EditorPage'
import { observer } from 'mobx-react'
import { CustomInput } from '../../../../utils/CustomInput'
import { Input, InputRef } from 'antd'

export const BookmarkInputComponent: React.FC<{
}> = observer(() => {
    const ref = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<InputRef>(null)
    useEffect(() => {
        if (ref && EditorPage.editor && EditorPage.editor.bookmarkInput) {
            EditorPage.editor.bookmarkInput.bookmarkInputRef = ref
            EditorPage.editor.bookmarkInput.inputRef = inputRef
        }
    }, [ref, inputRef, EditorPage.editor])

    const bookmarkInput = EditorPage.editor.bookmarkInput

    return (
        <Portal>
            <div
                style={{
                    userSelect: bookmarkInput.isOpen ? undefined : 'none',
                    zIndex: 10000,
                    width: '100%',
                    height: '100%'
                }}
            >
                <div
                    ref={ref}
                    className={'bookmark-input'}
                    style={{
                        userSelect: bookmarkInput.isOpen ? undefined : 'none',
                        opacity: bookmarkInput.isOpen ? '1' : '0',
                        top: -9999,
                        left: -9999
                    }}
                    onClick={(event) => {
                        event.stopPropagation()
                    }}
                >
                    <Input
                        ref={inputRef}
                        placeholder={'링크를 입력하세요'}
                        onChange={(e) => {
                            bookmarkInput.handleChange(e.target.value)
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                bookmarkInput.handleEnter()
                            }
                        }}
                        allowClear
                        status={bookmarkInput.isError && 'error'}
                        value={bookmarkInput.content}
                    />
                </div>
            </div>
        </Portal>
    )
})

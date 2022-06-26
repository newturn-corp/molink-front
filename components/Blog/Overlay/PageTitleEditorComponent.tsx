import { Portal } from '@material-ui/core'
import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import Blog from '../../../manager/global/Blog/Blog'
import EmojiPicker from '../../../manager/global/EmojiPicker'
import { Input, InputRef } from 'antd'

export const PageTitleEditorComponent: React.FC = observer(() => {
    const editorRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef(null)
    const pageTitleEditor = Blog.pageHierarchy.pageTitleEditor
    useEffect(() => {
        if (editorRef) {
            pageTitleEditor.editorRef = editorRef
        }
    }, [editorRef])
    useEffect(() => {
        if (inputRef) {
            pageTitleEditor.inputRef = inputRef
        }
    }, [inputRef])

    return <Portal>
        <div
            ref={editorRef}
            style={{
                position: 'absolute',
                top: -9999,
                left: -9999
            }}
        >
            <div
                className={'page-title-editor'}
            >
                <Input
                    ref={inputRef}
                    value={pageTitleEditor.title}
                    onChange={v => {
                        pageTitleEditor.title = v.target.value
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            pageTitleEditor.endTitleEditing()
                        }
                    }}
                    onClick={event => {
                        event.stopPropagation()
                    }}
                />
            </div>
        </div>
    </Portal>
})

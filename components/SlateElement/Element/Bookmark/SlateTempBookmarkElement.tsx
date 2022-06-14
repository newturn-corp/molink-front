import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    BookmarkElementType, TempBookmarkElementType
} from '../../../../Types/slate/CustomElement'
import BookmarkOutlineIcon from 'public/image/icon/bookmark-outline.svg'
import { MediaMenuButton } from '../../Extra/MediaMenuButton'
import MenuItem from '../../../../manager/global/Menu/MenuItem'
import LanguageManager from '../../../../manager/global/LanguageManager'
import { Transforms } from 'slate'
import { ReactEditor, useSlateStatic } from 'slate-react'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import { HistoryEditor } from 'slate-history'

export const SlateTempBookmarkElement: React.FC<{
    attributes,
    children,
    element: TempBookmarkElementType
}> = ({ attributes, children, element }) => {
    const [isMouseOver, setIsMouseOver] = useState(false)
    const slateEditor = useSlateStatic()
    const elementRef = useRef<HTMLDivElement>()
    const currentNodePath = useCallback(() => (
        ReactEditor.findPath(slateEditor, element)
    ), [slateEditor, element])
    const openBookmarkInput = useCallback(() => {
        const rect = elementRef.current.getBoundingClientRect()
        const position = {
            top: rect.top + (rect.height / 2),
            left: rect.left + (rect.width / 2) - 150
        }
        bookmarkInput.open(currentNodePath(), position)
    }, [elementRef])
    useEffect(() => {
        if (!element.isFirstInputOpen) {
            openBookmarkInput()
            HistoryEditor.withoutSaving(slateEditor, () => {
                Transforms.setNodes(slateEditor, {
                    isFirstInputOpen: true
                }, {
                    at: currentNodePath()
                })
            })
        }
    }, [element.isFirstInputOpen])
    const bookmarkInput = EditorPage.editor.bookmarkInput
    const editable = EditorPage.editor.editable

    return <div
        ref={elementRef}
        className={'temp-bookmark'}
        onMouseOver={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
        onClick={() => openBookmarkInput()}
    >
        <div
            className={'icon'}
            contentEditable={false}
        >
            <BookmarkOutlineIcon/>
        </div>
        <div
            className={'text'}
            contentEditable={false}
        >
            {'북마크 추가'}
        </div>
        {children}
        {
            editable && <MediaMenuButton
                isShow={isMouseOver}
                menuItems={[new MenuItem(LanguageManager.languageMap.Delete, () => {
                    Transforms.removeNodes(slateEditor, { at: currentNodePath() })
                })]}
                onClick={() => {
                    Transforms.select(slateEditor, currentNodePath())
                }}
                currentNodePath={currentNodePath()}
            />
        }
    </div>
}

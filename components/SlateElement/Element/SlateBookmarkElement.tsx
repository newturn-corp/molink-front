import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    BookmarkElementType
} from '../../../Types/slate/CustomElement'
import RoutingManager from '../../../manager/global/RoutingManager'
import { AnalyzeLinkResponseDTO } from '@newturn-develop/types-molink'
import mainAPI from '../../../api/mainAPI'
import { ReactEditor, useSelected } from 'slate-react'
import EditorManager from '../../../manager/Blog/EditorManager'
import { Transforms } from 'slate'
import MenuDotsIcon from '../../../public/image/icon/menu-dots.svg'
import MenuManager from '../../../manager/global/Menu/MenuManager'
import MenuItem from '../../../manager/global/Menu/MenuItem'
import LanguageManager from '../../../manager/global/LanguageManager'

export const SlateBookmarkElement: React.FC<{
    attributes,
    children,
    element: BookmarkElementType
}> = ({ attributes, children, element }) => {
    const selected = useSelected()
    const currentNodePath = useCallback(() => (
        ReactEditor.findPath(EditorManager.slateEditor, element)
    ), [EditorManager.slateEditor, element])
    const [isMouseOver, setIsMouseOver] = useState(false)
    const menuButtonRef = useRef<HTMLDivElement>()

    const [info, setInfo] = useState<AnalyzeLinkResponseDTO>({
        title: '링크',
        description: '설명',
        imageURL: undefined,
        iconURL: undefined
    })

    useEffect(() => {
        mainAPI.analyzeLink(element.url)
            .then((dto) => setInfo(dto))
    }, [])

    useEffect(() => {
        if (selected) {
            const reverse = ['ArrowUp', 'ArrowLeft', 'Backspace'].includes(EditorManager.lastPressedKey)
            Transforms.select(EditorManager.slateEditor, currentNodePath())
            Transforms.collapse(EditorManager.slateEditor, { edge: 'end' })
            Transforms.move(EditorManager.slateEditor, { unit: 'line', reverse })
        }
    }, [selected, EditorManager.slateEditor, currentNodePath])

    return <div
        contentEditable={false}
        className={'bookmark'}
        onClick={() => RoutingManager.rawMoveTo(element.url, true)}
        onMouseOver={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
    >
        {children}
        <div
            className={'text-container'}
        >
            <div
                className={'title'}
                contentEditable={false}
            >
                {info.title}
            </div>
            {
                info.description
                    ? <div
                        className={'description'}
                        contentEditable={false}
                    >
                        {info.description}
                    </div>
                    : <></>
            }
            <div
                className={'url-container'}
                contentEditable={false}
            >
                {
                    info.iconURL
                        ? <img
                            src={info.iconURL}
                            className={'icon'}
                        />
                        : <></>
                }
                <div
                    className={'url'}
                    contentEditable={false}
                >
                    {element.url}
                </div>
            </div>
        </div>
        {
            info.imageURL
                ? <div
                    className={'image-container'}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0
                        }}
                    >
                        <img
                            className={'image'}
                            src={info.imageURL}
                        />
                    </div>
                </div>
                : <></>
        }
        {
            <div
                ref={menuButtonRef}
                className={'menu-button'}
                style={{
                    display: isMouseOver ? undefined : 'none'
                }}
                onClick={(event) => {
                    event.stopPropagation()
                    const rect = menuButtonRef.current.getBoundingClientRect()
                    MenuManager.open([new MenuItem(LanguageManager.languageMap.Delete, () => {
                        Transforms.removeNodes(EditorManager.slateEditor, { at: currentNodePath() })
                    })], {
                        top: rect.top + (rect.height / 2),
                        left: rect.left + (rect.width / 2)
                    }, true)
                }}
            >
                <MenuDotsIcon/>
            </div>
        }
    </div>
}

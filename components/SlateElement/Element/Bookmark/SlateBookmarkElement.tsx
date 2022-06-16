import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    BookmarkElementType
} from '../../../../Types/slate/CustomElement'
import RoutingManager from '../../../../manager/global/RoutingManager'
import { AnalyzeLinkResponseDTO } from '@newturn-develop/types-molink'
import mainAPI from '../../../../api/mainAPI'
import { ReactEditor, useSelected, useSlateStatic } from 'slate-react'
import { Transforms } from 'slate'
import MenuDotsIcon from '../../../../public/image/icon/menu-dots.svg'
import MenuManager from '../../../../manager/global/Menu/MenuManager'
import MenuItem from '../../../../manager/global/Menu/MenuItem'
import LanguageManager from '../../../../manager/global/LanguageManager'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import { MediaMenuButton } from '../../Extra/MediaMenuButton'
import { SlateBookmarkImageContainer } from './SlateBookmarkImageContainer'

export const SlateBookmarkElement: React.FC<{
    attributes,
    children,
    element: BookmarkElementType
}> = ({ attributes, children, element }) => {
    const selected = useSelected()
    const slateEditor = useSlateStatic()
    const currentNodePath = useCallback(() => (
        ReactEditor.findPath(slateEditor, element)
    ), [slateEditor, element])
    const [isMouseOver, setIsMouseOver] = useState(false)
    const menuButtonRef = useRef<HTMLDivElement>()

    const [info, setInfo] = useState<AnalyzeLinkResponseDTO>({
        title: new URL(element.url).hostname,
        description: '',
        imageURL: undefined,
        iconURL: undefined
    })

    useEffect(() => {
        mainAPI.analyzeLink(element.url)
            .then((dto) => setInfo(dto))
    }, [])

    useEffect(() => {
        if (selected) {
            const reverse = ['ArrowUp', 'ArrowLeft', 'Backspace'].includes(EditorPage.editor.lastPressedKey)
            Transforms.select(slateEditor, currentNodePath())
            Transforms.collapse(slateEditor, { edge: 'end' })
            Transforms.move(slateEditor, { unit: 'line', reverse })
        }
    }, [selected, slateEditor, currentNodePath])

    const editable = EditorPage.editor.editable

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
                info.description &&
                <div
                    className={'description'}
                    contentEditable={false}
                >
                    {info.description}
                </div>
            }
            <div
                className={'url-container'}
                contentEditable={false}
            >
                {
                    info.iconURL &&
                    <img
                        src={info.iconURL}
                        className={'icon'}
                    />
                }
                <div
                    className={'url'}
                    contentEditable={false}
                >
                    {element.url}
                </div>
            </div>
        </div>
        <SlateBookmarkImageContainer
            imageUrl={info.imageURL}
        />
        {
            editable && <MediaMenuButton
                isShow={isMouseOver}
                menuItems={[
                    new MenuItem(LanguageManager.languageMap.Delete, () => {
                        Transforms.removeNodes(slateEditor, { at: currentNodePath() })
                    }),
                    new MenuItem('복제', () => {
                        Transforms.insertNodes(slateEditor, {
                            ...element
                        }, {
                            at: currentNodePath(),
                            mode: 'lowest'
                        })
                    })
                ]}
                onClick={() => {
                    Transforms.select(slateEditor, currentNodePath())
                }}
                currentNodePath={currentNodePath()}
            />
        }
    </div>
}

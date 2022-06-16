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
import moment from 'moment-timezone'
import { HistoryEditor } from 'slate-history'

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

    useEffect(() => {
        if (!element.lastLoadedAt || moment(element.lastLoadedAt).isBefore(moment().subtract(7, 'days'))) {
            mainAPI.analyzeLink(element.url)
                .then((dto) => {
                    HistoryEditor.withoutSaving(slateEditor, () => {
                        Transforms.setNodes(slateEditor, {
                            ...dto,
                            lastLoadedAt: moment().format('YYYY-MM-DD HH:mm:ss')
                        }, {
                            at: currentNodePath()
                        })
                    })
                })
        }
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
                {element.title}
            </div>
            {
                element.description &&
                <div
                    className={'description'}
                    contentEditable={false}
                >
                    {element.description}
                </div>
            }
            <div
                className={'url-container'}
                contentEditable={false}
            >
                {
                    element.iconURL &&
                    <img
                        src={element.iconURL}
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
            imageUrl={element.imageURL}
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

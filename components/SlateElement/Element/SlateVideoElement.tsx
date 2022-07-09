import React, { useCallback, useRef, useState } from 'react'
import {
    SlateVideoElementType
} from '../../../Types/slate/CustomElement'
import ReactPlayer from 'react-player'
import FileUploadManager from '../../../manager/Editing/FileUploadManager'
import { ReactEditor, useFocused, useSelected, useSlateStatic } from 'slate-react'
import { SlateMediaElement } from './MediaElement'
import { FileLoading } from './FileLoading'
import MenuManager from '../../../manager/global/Menu/MenuManager'
import MenuItem from '../../../manager/global/Menu/MenuItem'
import { Transforms } from 'slate'
import MenuDotsIcon from '../../../public/image/icon/menu-dots.svg'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'

const getVideoSrc = (src: string) => {
    if (src && src.includes('https://cdn.filestackcontent.com')) {
        return src + `?policy=${FileUploadManager.policy}&signature=${FileUploadManager.signature}`
    } else if (src && src.includes('molink.life/files')) {
        return src + `?pageId=${EditorPage.pageId}`
    }
    return src
}

export const SlateVideoElement: React.FC<{
    attributes,
    children,
    element: SlateVideoElementType
}> = ({ attributes, children, element }) => {
    const selected = useSelected()
    const focused = useFocused()
    const [isReady, setIsReady] = useState(false)
    const slateEditor = useSlateStatic()
    const currentNodePath = useCallback(() => (
        ReactEditor.findPath(slateEditor, element)
    ), [slateEditor, element])
    const [isMouseOver, setIsMouseOver] = useState(false)
    const menuButtonRef = useRef<HTMLDivElement>()

    const editable = EditorPage.editor.editable

    return (
        <>
            {children}
            <FileLoading
                isLoading={!isReady}
                fileName={element.name}
                fileSize={element.size}
            />
            {
                !element.isUploading
                    ? <div
                        className={'video-element'}
                        style={{
                            display: isReady ? undefined : 'none'
                        }}
                        onMouseOver={() => setIsMouseOver(true)}
                        onMouseLeave={() => setIsMouseOver(false)}
                    >
                        <SlateMediaElement element={element}>
                            <ReactPlayer
                                width={'100%'}
                                height={'100%'}
                                url={`${getVideoSrc(element.url)}`}
                                onReady={() => setIsReady(true)}
                                style={{
                                    boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
                                    width: '100%',
                                    height: '100%'
                                }}
                                controls={true}
                            />
                            {
                                editable && <div
                                    ref={menuButtonRef}
                                    className={'menu-button'}
                                    style={{
                                        display: isMouseOver ? undefined : 'none'
                                    }}
                                    onClick={(event) => {
                                        if (!editable) {
                                            return false
                                        }
                                        event.stopPropagation()
                                        Transforms.select(slateEditor, currentNodePath())
                                        const rect = menuButtonRef.current.getBoundingClientRect()
                                        MenuManager.open([new MenuItem('삭제', () => {
                                            Transforms.removeNodes(slateEditor, { at: currentNodePath() })
                                        })], {
                                            top: rect.top + (rect.height / 2),
                                            left: rect.left + (rect.width / 2)
                                        }, true)
                                    }}
                                >
                                    <MenuDotsIcon/>
                                </div>
                            }
                        </SlateMediaElement>
                    </div>
                    : <></>
            }
        </>
    )
}

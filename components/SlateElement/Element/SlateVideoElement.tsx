import React, { useCallback, useRef, useState } from 'react'
import {
    SlateVideoElementType
} from '../../../Types/slate/CustomElement'
import ReactPlayer from 'react-player'
import FileUploadManager from '../../../manager/Editing/FileUploadManager'
import EditorManager from '../../../manager/Blog/EditorManager'
import { ReactEditor, useFocused, useSelected } from 'slate-react'
import { SlateMediaElement } from './MediaElement'
import { FileLoading } from './FileLoading'
import MenuManager from '../../../manager/global/Menu/MenuManager'
import MenuItem from '../../../manager/global/Menu/MenuItem'
import { Transforms } from 'slate'
import MenuDotsIcon from '../../../public/image/icon/menu-dots.svg'

const getVideoSrc = (src: string) => {
    if (src && src.includes('https://cdn.filestackcontent.com')) {
        return src + `?policy=${FileUploadManager.policy}&signature=${FileUploadManager.signature}`
    } else if (src && src.includes('molink.life/files')) {
        return src + `?pageId=${EditorManager.pageId}`
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
    const currentNodePath = useCallback(() => (
        ReactEditor.findPath(EditorManager.slateEditor, element)
    ), [EditorManager.slateEditor, element])
    const [isMouseOver, setIsMouseOver] = useState(false)
    const menuButtonRef = useRef<HTMLDivElement>()

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
                                <div
                                    ref={menuButtonRef}
                                    className={'menu-button'}
                                    style={{
                                        display: isMouseOver ? undefined : 'none'
                                    }}
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        Transforms.select(EditorManager.slateEditor, currentNodePath())
                                        const rect = menuButtonRef.current.getBoundingClientRect()
                                        MenuManager.open([new MenuItem('삭제', () => {
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
                        </SlateMediaElement>
                    </div>
                    : <></>
            }
        </>
    )
}

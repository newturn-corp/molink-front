import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    SlateFileElementType,
    SlateVideoElementType
} from '../../../Types/slate/CustomElement'
import ReactPlayer from 'react-player'
import FileUploadManager from '../../../manager/Editing/FileUploadManager'
import EditorManager from '../../../manager/Blog/EditorManager'
import { ReactEditor, useFocused, useSelected } from 'slate-react'
import { SlateMediaElement } from './MediaElement'
import { CircularProgress } from '@material-ui/core'
import { getFileSizeString } from '../../../utils/getFileSizeString'
import { FileLoading } from './FileLoading'
import { DescriptionOutlined } from '@material-ui/icons'
import RoutingManager from '../../../manager/global/RoutingManager'
import { Transforms } from 'slate'
import download from 'downloadjs'
import axios from 'axios'
import MenuManager from '../../../manager/global/Menu/MenuManager'
import MenuItem from '../../../manager/global/Menu/MenuItem'
import MenuDotsIcon from '../../../public/image/icon/menu-dots.svg'

const getFileSrc = (src: string) => {
    if (src && src.includes('https://cdn.filestackcontent.com')) {
        return src + `?policy=${FileUploadManager.policy}&signature=${FileUploadManager.signature}`
    } else if (src && src.includes('molink.life/files')) {
        return src + `?pageId=${EditorManager.pageId}`
    }
    return src
}

export const SlateFileElement: React.FC<{
    attributes,
    children,
    element: SlateFileElementType
}> = ({ attributes, children, element }) => {
    const selected = useSelected()
    const currentNodePath = useCallback(() => (
        ReactEditor.findPath(EditorManager.slateEditor, element)
    ), [EditorManager.slateEditor, element])
    const [isMouseOver, setIsMouseOver] = useState(false)
    const menuButtonRef = useRef<HTMLDivElement>()

    useEffect(() => {
        if (selected) {
            const reverse = ['ArrowUp', 'ArrowLeft', 'Backspace'].includes(EditorManager.lastPressedKey)
            Transforms.select(EditorManager.slateEditor, currentNodePath())
            Transforms.collapse(EditorManager.slateEditor, { edge: 'end' })
            Transforms.move(EditorManager.slateEditor, { unit: 'line', reverse })
        }
    }, [selected, EditorManager.slateEditor, currentNodePath])

    return (
        <div>
            {children}
            {
                element.isUploading
                    ? <FileLoading
                        isLoading={element.isUploading}
                        fileName={element.name}
                        fileSize={element.size}
                    />
                    : <div
                        className={'file'}
                        onMouseOver={() => setIsMouseOver(true)}
                        onMouseLeave={() => setIsMouseOver(false)}
                        onClick={async () => {
                            // download(getFileSrc(element.url))
                            if (element.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || element.name.split('.').pop() === 'docx') {
                                axios.get(
                                    getFileSrc(element.url)
                                    ,
                                    {
                                        responseType: 'blob',
                                        withCredentials: true
                                    }
                                ).then((response) => {
                                    const url = window.URL.createObjectURL(new Blob([response.data]))
                                    const link = document.createElement('a')
                                    link.href = url
                                    link.setAttribute('download', element.name) // or any other extension
                                    document.body.appendChild(link)
                                    link.click()
                                })
                            } else {
                                await RoutingManager.rawMoveTo(getFileSrc(element.url), true)
                            }
                        }}
                        contentEditable={false}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                padding: 5,
                                height: 35
                            }}
                        >
                            <DescriptionOutlined/>
                            <div
                                className={'name'}
                            >
                                {element.name}
                            </div>
                            <div
                                className={'size'}
                            >
                                {getFileSizeString(element.size)}
                            </div>
                        </div>
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
                    </div>
            }
        </div>
    )
}

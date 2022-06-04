import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    SlateFileElementType
} from '../../../Types/slate/CustomElement'
import FileUploadManager from '../../../manager/Editing/FileUploadManager'
import { ReactEditor, useSelected, useSlateStatic } from 'slate-react'
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
import EditorPage from '../../../manager/Blog/Editor/EditorPage'

const getFileSrc = (src: string) => {
    if (src && src.includes('https://cdn.filestackcontent.com')) {
        return src + `?policy=${FileUploadManager.policy}&signature=${FileUploadManager.signature}`
    } else if (src && src.includes('molink.life/files')) {
        return src + `?pageId=${EditorPage.pageId}`
    }
    return src
}

export const SlateFileElement: React.FC<{
    attributes,
    children,
    element: SlateFileElementType
}> = ({ attributes, children, element }) => {
    const selected = useSelected()
    const slateEditor = useSlateStatic()
    const currentNodePath = useCallback(() => (
        ReactEditor.findPath(slateEditor, element)
    ), [slateEditor, element])
    const [isMouseOver, setIsMouseOver] = useState(false)
    const menuButtonRef = useRef<HTMLDivElement>()

    const editor = EditorPage.editor

    useEffect(() => {
        if (selected) {
            const reverse = ['ArrowUp', 'ArrowLeft', 'Backspace'].includes(editor.lastPressedKey)
            Transforms.select(slateEditor, currentNodePath())
            Transforms.collapse(slateEditor, { edge: 'end' })
            Transforms.move(slateEditor, { unit: 'line', reverse })
        }
    }, [selected, slateEditor, currentNodePath])

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
                                contentEditable={false}
                            >
                                {element.name}
                            </div>
                            <div
                                className={'size'}
                                contentEditable={false}
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
                    </div>
            }
        </div>
    )
}

import React, { useRef, useState } from 'react'
import {
    FloatOption, SlateImageElementType,
    SlateVideoElementType
} from '../../../Types/slate/CustomElement'
import ReactPlayer from 'react-player'
import FileUploadManager from '../../../manager/Editing/FileUploadManager'
import EditorManager from '../../../manager/Blog/EditorManager'
import { useFocused, useSelected } from 'slate-react'
import StyleManager from '../../../manager/global/Style/StyleManager'
import { Transforms } from 'slate'
import { css } from '@emotion/css'
import { FormatAlignCenter, FormatAlignLeft, FormatAlignRight } from '@material-ui/icons'
import { Rnd } from 'react-rnd'
import { Caption } from './Caption'

const getVideoSrc = (src: string) => {
    if (src && src.includes('https://cdn.filestackcontent.com')) {
        return src + `?policy=${FileUploadManager.policy}&signature=${FileUploadManager.signature}`
    } else if (src && src.includes('molink.life/files')) {
        return src + `?pageId=${EditorManager.pageId}`
    }
    return src
}

export const SlateMediaElement: React.FC<{
    children,
    element: SlateVideoElementType | SlateImageElementType
}> = ({ children, element }) => {
    const selected = useSelected()
    const focused = useFocused()
    if (element.isUploading) {
        return <div>
            {'로딩 중..'}
            {children}
        </div>
    }
    return (
        <div
            className={'media-element'}
        >
            <div
                contentEditable={false}
                className={css`
                    position: relative;
                    margin: 10px;
                    width: ${StyleManager.contentStyle.main.width}px;
                    `}
            >
                <Rnd
                    default={{
                        x: 0,
                        y: 0,
                        width: element.width,
                        height: element.height
                    }}
                    disableDragging
                    //   enableResizing={selected && focused}
                    enableResizing={true}
                    lockAspectRatio
                    style={{
                        position: 'relative',
                        float: element.floatOption === FloatOption.Right ? 'right' : undefined,
                        marginLeft: element.floatOption === FloatOption.Center ? (StyleManager.contentStyle.main.width - element.width) / 2 : undefined,
                        transform: 'none !important',
                        display: 'block'
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        const widthStr = ref.style.width
                        const heightStr = ref.style.height
                        const width = Number(widthStr.slice(0, widthStr.length - 2))
                        const height = Number(heightStr.slice(0, heightStr.length - 2))
                        Transforms.setNodes(EditorManager.slateEditor, {
                            width,
                            height
                        }, {
                            at: EditorManager.slateEditor.selection
                        })
                    }}
                >
                    <figure style={{
                        width: '100%',
                        height: '100%'
                    }}>
                        {children}
                    </figure>
                    {
                        selected && focused
                            ? <>
                                <div
                                    className='image-adjust-button'
                                    style={{
                                        left: (element.width - 100) / 2
                                    }}>
                                    <div
                                        className={'button'}
                                        onClick={event => {
                                            Transforms.setNodes(EditorManager.slateEditor, {
                                                floatOption: FloatOption.Left
                                            }, {
                                                at: EditorManager.slateEditor.selection
                                            })
                                        }}
                                    >
                                        <FormatAlignLeft />
                                    </div>
                                    <div
                                        className={'button'}
                                        onClick={event => {
                                            Transforms.setNodes(EditorManager.slateEditor, {
                                                floatOption: FloatOption.Center
                                            }, {
                                                at: EditorManager.slateEditor.selection
                                            })
                                        }}
                                    >
                                        <FormatAlignCenter />
                                    </div>
                                    <div
                                        className={'button'}
                                        onClick={event => {
                                            Transforms.setNodes(EditorManager.slateEditor, {
                                                floatOption: FloatOption.Right
                                            }, {
                                                at: EditorManager.slateEditor.selection
                                            })
                                        }}
                                    >
                                        <FormatAlignRight />
                                    </div>
                                </div>
                                <div
                                    className='image-resize-dot'
                                    style={{
                                        top: -7.5,
                                        left: -7.5
                                    }}>
                                </div>
                                <div
                                    className='image-resize-dot'
                                    style={{
                                        top: -7.5,
                                        right: -7.5
                                    }}>
                                </div>
                                <div
                                    className='image-resize-dot'
                                    style={{
                                        bottom: -7.5,
                                        left: -7.5
                                    }}>
                                </div>
                                <div
                                    className='image-resize-dot'
                                    style={{
                                        bottom: -7.5,
                                        right: -7.5
                                    }}>
                                </div>
                            </>
                            : <></>
                    }
                </Rnd>
                <Caption selected={selected} caption={element.caption} floatOption={element.floatOption}/>
            </div>
        </div>
    )
}

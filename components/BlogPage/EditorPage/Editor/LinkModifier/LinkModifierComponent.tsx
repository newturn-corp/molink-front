import React, { useEffect, useRef } from 'react'
import { Portal } from '../../../../utils/Portal'
import EditorPage from '../../../../../manager/Blog/Editor/EditorPage'
import { observer } from 'mobx-react'
import { Input, InputRef } from 'antd'
import { MenuItem } from '../../../../utils/Menu/MenuItem'
import LinkRoundedIcon from 'public/image/icon/link-rounded.svg'

export const LinkModifierComponent: React.FC<{
}> = observer(() => {
    const ref = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<InputRef>(null)
    useEffect(() => {
        if (ref && EditorPage.editor && EditorPage.editor.linkModifier) {
            EditorPage.editor.linkModifier.linkModifierRef = ref
        }
    }, [ref, inputRef, EditorPage.editor])

    const linkModifier = EditorPage.editor.linkModifier

    return (
        <Portal>
            <div
                style={{
                    userSelect: linkModifier.isOpen ? undefined : 'none',
                    display: linkModifier.isOpen ? undefined : 'none',
                    zIndex: 10000,
                    width: '100%',
                    height: '100%'
                }}
            >
                <div
                    ref={ref}
                    className={'link-modifier'}
                    style={{
                        userSelect: linkModifier.isOpen ? undefined : 'none',
                        opacity: linkModifier.isOpen ? '1' : '0'
                    }}
                    onClick={(event) => {
                        event.stopPropagation()
                    }}
                >
                    <div
                        className={'link-block'}
                        onMouseOver={() => {
                            linkModifier.index = 0
                        }}
                        onClick={async (event) => {
                            await linkModifier.moveToLinkPage()
                            linkModifier.close()
                        }}
                        style={{
                            backgroundColor: linkModifier.index === 0 ? '#F2F3F5' : undefined
                        }}
                    >
                        <div
                            className={'move-to-text'}
                        >
                            {'여기로 이동'}
                        </div>
                        <div
                            className={'link'}
                        >
                            <div
                                className={'icon'}
                            >
                                <LinkRoundedIcon/>
                            </div>
                            <div
                                className={'text'}
                                style={{
                                    color: linkModifier.index === 0 ? '#3A7BBF' : undefined
                                }}
                            >
                                {linkModifier.slateLinkElement?.url}
                            </div>
                        </div>
                    </div>
                    <div
                        className={'divider'}
                    />
                    <MenuItem
                        text={'링크 복사'}
                        onClick={async () => {
                            await linkModifier.copyLink()
                            linkModifier.close()
                        }}
                        selected={linkModifier.index === 1}
                        onMouseOver={() => {
                            linkModifier.index = 1
                        }}
                    />
                    <MenuItem
                        text={'링크 삭제'}
                        onClick={async () => {
                            await linkModifier.deleteLink()
                            linkModifier.close()
                        }}
                        selected={linkModifier.index === 2}
                        onMouseOver={() => {
                            linkModifier.index = 2
                        }}
                    />
                </div>
            </div>
        </Portal>
    )
})

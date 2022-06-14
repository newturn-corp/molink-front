import React, { useRef } from 'react'
import {
    useSlateStatic
} from 'slate-react'
import { Path, Transforms } from 'slate'
import MenuManager from '../../../manager/global/Menu/MenuManager'
import MenuItem from '../../../manager/global/Menu/MenuItem'
import MenuDotsIcon from '../../../public/image/icon/menu-dots.svg'

export const MediaMenuButton: React.FC<{
    menuItems: MenuItem[]
    isShow: boolean,
    currentNodePath: Path,
    onClick?: Function
}> = ({ menuItems, isShow, currentNodePath, onClick }) => {
    const menuButtonRef = useRef<HTMLDivElement>()

    return (
        <div
            ref={menuButtonRef}
            className={'menu-button'}
            style={{
                opacity: isShow ? 1 : 0
            }}
            onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                if (onClick) {
                    onClick()
                }
                const rect = menuButtonRef.current.getBoundingClientRect()
                MenuManager.open(menuItems, {
                    top: rect.top + (rect.height / 2),
                    left: rect.left + (rect.width / 2)
                }, true)
            }}
        >
            <MenuDotsIcon/>
        </div>
    )
}

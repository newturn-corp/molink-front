import React, { CSSProperties, useEffect } from 'react'
import { Portal } from '../Portal'

export interface MenuProps {
    isOpen: boolean,
    onClose: Function,
    style?: CSSProperties,
    menuRef?: React.MutableRefObject<HTMLDivElement>
}

export const Menu: React.FC<MenuProps> = ({ children, isOpen, onClose, style, menuRef }) => {
    useEffect(() => {
        document.getElementsByTagName('body')[0].addEventListener('click', (event) => {
            onClose(event)
        })
    }, [])
    return <Portal>
        <div
            style={{
                display: isOpen ? undefined : 'none',
                zIndex: 10000,
                width: '100%',
                height: '100%'
            }}
            onClick={(event) => onClose(event)}
            onScroll={(event) => {
                event.stopPropagation()
                event.preventDefault()
            }}
        >
            <div
                ref={menuRef || undefined}
                className={'menu'}
                style={style || {}}
            >
                {children}
            </div>
        </div>
    </Portal>
}

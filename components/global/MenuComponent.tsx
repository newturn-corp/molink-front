import React, { useEffect, useRef, useState } from 'react'
import MenuManager from '../../manager/global/Menu/MenuManager'
import { Portal } from '../utils/Portal'
import { observer } from 'mobx-react'
import { MenuItem } from '../utils/Menu/MenuItem'

export const MenuComponent: React.FC<{}> = observer(() => {
    const menuRef = useRef<HTMLDivElement>()
    useEffect(() => {
        document.getElementsByTagName('body')[0].addEventListener('click', (event) => {
            MenuManager.close()
        })
        MenuManager.menuRef = menuRef
    }, [])
    return <Portal>
        <div
            style={{
                userSelect: MenuManager.isOpen ? undefined : 'none',
                zIndex: 10000,
                width: '100%',
                height: '100%'
            }}
            onClick={(event) => {
                MenuManager.close()
            }}
            onScroll={(event) => {
                event.stopPropagation()
                event.preventDefault()
            }}
        >
            <div
                ref={menuRef}
                className={'menu'}
                style={{
                    userSelect: MenuManager.isOpen ? undefined : 'none',
                    opacity: MenuManager.isOpen ? '1' : '0'
                }}
            >
                {
                    MenuManager.menuItemList.map((item, index) => {
                        return <MenuItem
                            key={`menu-item-${item.name}`}
                            text={item.name}
                            selected={MenuManager.keyboardSelectionChange && MenuManager.index === index}
                            onClick={() => item.onClick()}
                        />
                    })
                }
            </div>
        </div>
    </Portal>
})
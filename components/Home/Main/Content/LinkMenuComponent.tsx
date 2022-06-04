import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import LinkManager from '../../../../manager/Editing/Link/LinkManager'
import { MenuItem } from '../../../utils/Menu/MenuItem'
import { Menu } from '../../../utils/Menu/Menu'

export const LinkMenuComponent: React.FC<{
}> = observer(() => {
    const menuRef = useRef<HTMLDivElement | null>()

    useEffect(() => {
        const menuElement = menuRef.current
        const domSelection = window.getSelection()
        if (!domSelection.rangeCount) {
            return
        }
        setTimeout(() => {
            const domRange = domSelection.getRangeAt(0)
            const rect = domRange.getBoundingClientRect()
            if (globalThis.document.body.clientHeight < rect.top + menuElement.offsetHeight + 100) {
                menuElement.style.top = `${rect.top - menuElement.offsetHeight - 5}px`
            } else {
                menuElement.style.top = `${rect.top + rect.height + 5}px`
            }
            if (global.document.body.clientWidth < rect.left + menuElement.offsetWidth + 100) {
                menuElement.style.left = `${rect.left - menuElement.offsetWidth}px`
            } else {
                menuElement.style.left = `${rect.left}px`
            }
        }, 0)
    }, [LinkManager.menu.isLinkMenuOpen])

    return <Menu
        menuRef={menuRef}
        isOpen={LinkManager.menu.isLinkMenuOpen}
        onClose={() => {
            LinkManager.menu.close()
        }}
        style={{
            position: 'absolute'
        }}
    >
        {
            LinkManager.menu.menuItemList.map((item, index) => {
                return <MenuItem
                    key={`link-menu-item-${item.name}`}
                    text={item.name}
                    selected={LinkManager.menu.index === index}
                    onClick={() => item.onClick}
                />
            })
        }
    </Menu>
})

import React from 'react'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { isBrowser } from 'react-device-detect'
import MenuDotsIcon from 'public/image/icon/menu-dots.svg'

export const PageMenuButton: React.FC<{
    documentId: string
}> = observer(({ documentId }) => {
    const handleClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        event.stopPropagation()
        if (isBrowser) {
            await HierarchyManager.openContextMenu(documentId)
        } else {
            const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
            currentHierarchy.selectedPageId = documentId
            HierarchyManager.initAvailControlOptions(currentHierarchy, documentId)
            HierarchyManager.isHierarchyOptionOpen = true
        }
    }

    return <div
        className='menu-button'
        onClick={(event) => handleClick(event)}
        style={{
            marginRight: isBrowser ? 3 : 6
        }}
    >
        <MenuDotsIcon/>
    </div>
})

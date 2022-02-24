import React from 'react'
import { observer } from 'mobx-react'
import { Add, ArrowDropDown, ArrowRight, Menu } from '@material-ui/icons'
import HierarchyManager from '../../../../manager/Home/Hierarchy/HierarchyManager'

export const DocumentMenuButton: React.FC<{
    documentId: string
}> = observer(({ documentId }) => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    const handleClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        event.stopPropagation()
        await HierarchyManager.openContextMenu(documentId)
    }

    return <div className='menu-button' onClick={(event) => handleClick(event)}>
        <Menu />
    </div>
})

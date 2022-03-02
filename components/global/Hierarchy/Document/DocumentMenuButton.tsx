import React from 'react'
import { observer } from 'mobx-react'
import { Menu } from '@material-ui/icons'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'

export const DocumentMenuButton: React.FC<{
    documentId: string
}> = observer(({ documentId }) => {
    const handleClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        event.stopPropagation()
        await HierarchyManager.openContextMenu(documentId)
    }

    return <div
        className='menu-button'
        onClick={(event) => handleClick(event)}
    >
        <Menu />
    </div>
})

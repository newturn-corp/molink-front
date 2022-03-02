import React from 'react'
import { observer } from 'mobx-react'
import { Add } from '@material-ui/icons'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'

export const DocumentAddChildButton: React.FC<{
    documentId: string
}> = observer(({ documentId }) => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    const document = currentHierarchy.map[documentId]
    const handleClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        await currentHierarchy.createDocument(document.children.length, documentId)
    }

    return <div
        className='add-page-button'
        onClick={(event) => handleClick(event)}
    >
        <Add />
    </div>
})

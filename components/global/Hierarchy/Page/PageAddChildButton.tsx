import React from 'react'
import { observer } from 'mobx-react'
import { Add } from '@material-ui/icons'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { isBrowser, isMobile } from 'react-device-detect'

export const PageAddChildButton: React.FC<{
    documentId: string
}> = observer(({ documentId }) => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    const document = currentHierarchy.map[documentId]
    const handleClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        await currentHierarchy.createPage(document.children.length, documentId)
        if (isMobile) {
            HierarchyManager.isHierarchyOpen = false
        }
    }

    return <div
        className='add-page-button'
        onClick={(event) => handleClick(event)}
        style={{
            marginRight: isBrowser ? 8 : 12
        }}
    >
        <Add />
    </div>
})

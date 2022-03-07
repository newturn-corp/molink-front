import React from 'react'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { LockButton } from './LockButton'

export const ContentControlButtonGroup: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy || !currentHierarchy.openedDocumentId) {
        return <></>
    }
    return <div
        className={'content-control-button-group'}
    >
        <LockButton></LockButton>
    </div>
})

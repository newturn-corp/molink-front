import React from 'react'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'

export const MobilePageTitle: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy || !currentHierarchy.openedPageId) {
        return <></>
    }
    const page = currentHierarchy.map[currentHierarchy.openedPageId]
    return <div
        className={'mobile-header-page-title'}
    >{page.icon + ' ' + page.title}</div>
})

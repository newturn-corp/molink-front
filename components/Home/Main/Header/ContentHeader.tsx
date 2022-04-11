import { observer } from 'mobx-react'
import React from 'react'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Blog/EditorManager'
import { PageHierarchyList } from './PageHierarchyList'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import { ContentControlButtonGroup } from './ContentControlButtonGroup'

export const ContentHeader: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy || !currentHierarchy.openedPageId) {
        return <></>
    }
    return <div
        className={'content-header'}
        style={StyleManager.contentStyle.header}
    >
        <PageHierarchyList/>
        {
            currentHierarchy.editable
                ? <ContentControlButtonGroup/>
                : <></>
        }

    </div>
})

import { observer } from 'mobx-react'
import React, { useCallback, useState } from 'react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Blog/EditorManager'
import { PageHierarchyList } from './PageHierarchyList'
import { ContentControlButtonGroup } from './ContentControlButtonGroup'

export const EditorHeader: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    const getHeaderStyle = useCallback(() => {
        if (!EditorManager.editable || EditorManager.isLocked) {
            return {
                height: 40,
                top: 0
            }
        } else {
            return {
                height: 40,
                top: EditorManager.isToolbarOpen ? 90 : 40
            }
        }
    }, [EditorManager.isToolbarOpen, EditorManager.editable, EditorManager.isLocked])
    if (!currentHierarchy || !currentHierarchy.openedPageId || !EditorManager.isLoaded) {
        return <></>
    }
    return <div
        className={'content-header'}
        style={getHeaderStyle()}
    >
        <PageHierarchyList/>
        {
            currentHierarchy.editable
                ? <ContentControlButtonGroup/>
                : <></>
        }

    </div>
})

import { observer } from 'mobx-react'
import React from 'react'
import { ContentHeaderIcon } from './ContentHeaderIcon'
import { EditorContainer } from './EditorContainer'
import { ContentTitleComponent } from './ContentTitleComponent'
import { ContentFooter } from './ContentFooter'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import { PageUserInfoComponent } from './PageUserInfoComponent'
import EditorManager from '../../../../manager/Blog/EditorManager'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'

export const ContentComponent: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy || !currentHierarchy.openedPageId) {
        return <></>
    }
    return <>
        <div className={'contents'}
            style={StyleManager.contentStyle.main}
        >
            <ContentHeaderIcon/>
            <ContentTitleComponent/>
            {
                EditorManager.editable && !EditorManager.isLocked
                    ? <></>
                    : <PageUserInfoComponent/>
            }
            <EditorContainer/>
        </div>
        <ContentFooter/>
    </>
})

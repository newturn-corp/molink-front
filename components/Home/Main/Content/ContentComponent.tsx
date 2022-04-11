import { observer } from 'mobx-react'
import React from 'react'
import { ContentForEmptyDocument } from './ContentForEmptyDocument'
import { ContentHeaderIcon } from './ContentHeaderIcon'
import { EditorContainer } from './EditorContainer'
import { ContentTitleComponent } from './ContentTitleComponent'
import { ContentFooter } from './ContentFooter'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import StyleManager from '../../../../manager/global/Style/StyleManager'

export const ContentComponent: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy || !currentHierarchy.openedPageId) {
        return <div className={'contents'}
            style={StyleManager.contentStyle.main}>
            <ContentForEmptyDocument />
        </div>
    }
    return <>
        <div className={'contents'}
            style={StyleManager.contentStyle.main}
        >
            <ContentHeaderIcon/>
            <ContentTitleComponent/>
            <EditorContainer/>
        </div>
        <ContentFooter/>
    </>
})

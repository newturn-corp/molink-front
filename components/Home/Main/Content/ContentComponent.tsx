import { observer } from 'mobx-react'
import React from 'react'
import { ContentForEmptyDocument } from './ContentForEmptyDocument'
import { ContentHeaderIcon } from './ContentHeaderIcon'
import { EditorContainer } from './EditorContainer'
import StyleManager from '../../../../manager/global/StyleManager'
import HierarchyManager from '../../../../manager/Home/Hierarchy/HierarchyManager'
import { ContentTitleComponent } from './ContentTitleComponent'

export const ContentComponent: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyNickname)
    if (!currentHierarchy || !currentHierarchy.openedDocumentId) {
        return <div className={'contents'}
            style={StyleManager.contentStyle.content}>
            <ContentForEmptyDocument />
        </div>
    }
    return <div className={'contents'}
        style={StyleManager.contentStyle.content}>
        <ContentHeaderIcon/>
        <ContentTitleComponent/>
        <EditorContainer/>
        <div className='content-footer'></div>
    </div>
})

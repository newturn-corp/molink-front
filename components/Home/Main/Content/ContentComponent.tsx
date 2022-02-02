import { observer } from 'mobx-react'
import React from 'react'
import { ContentForEmptyDocument } from './ContentForEmptyDocument'
import { ContentHeaderIcon } from './ContentHeaderIcon'
import { EditorContainer } from './EditorContainer'
import StyleManager from '../../../../manager/global/StyleManager'
import HierarchyManager from '../../../../manager/Home/Hierarchy/HierarchyManager'

export const ContentComponent: React.FC<{
}> = observer(() => {
    if (!HierarchyManager.hierarchy.openedDocumentId) {
        return <div className={'contents'}
            style={StyleManager.contentStyle.content}>
            <ContentForEmptyDocument />
        </div>
    }
    return <div className={'contents'}
        style={StyleManager.contentStyle.content}>
        <ContentHeaderIcon/>
        <EditorContainer/>
        <div className='content-footer'></div>
    </div>
})

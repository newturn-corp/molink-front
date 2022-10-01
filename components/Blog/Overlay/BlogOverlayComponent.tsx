import React from 'react'
import { observer } from 'mobx-react'
import Blog from '../../../manager/global/Blog/Blog'
import { PageTitleEditorComponent } from './PageTitleEditorComponent'
import { DragIndicator } from './DragIndicator'
import { HierarchyContextMenu } from './HierarchyContextMenu'
import { DragGhostParent } from '../DragGhostParent'

export const BlogOverlayComponent: React.FC<{
}> = observer(() => {
    return (
        <>
            <DragGhostParent/>
            {
                Blog.pageHierarchy.pageTitleEditor && <PageTitleEditorComponent/>
            }
            {
                Blog.isOpen && Blog.authority.editable && <>
                    <DragIndicator/>
                    <HierarchyContextMenu/>
                </>
            }
        </>
    )
})

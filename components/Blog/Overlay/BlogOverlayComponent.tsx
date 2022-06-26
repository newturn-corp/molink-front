import React from 'react'
import { observer } from 'mobx-react'
import Blog from '../../../manager/global/Blog/Blog'
import { PageTitleEditorComponent } from './PageTitleEditorComponent'

export const BlogOverlayComponent: React.FC<{
}> = observer(() => {
    return (
        <>
            {
                Blog.pageHierarchy.pageTitleEditor && <PageTitleEditorComponent/>
            }
        </>
    )
})

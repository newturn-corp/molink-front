import React from 'react'
import { observer } from 'mobx-react'
import Blog from '../../../../manager/global/Blog/Blog'

export const MobilePageTitle: React.FC<{
}> = observer(() => {
    const pageHierarchy = Blog.pageHierarchy
    if (!pageHierarchy || !pageHierarchy.openedPage) {
        return <></>
    }
    return <div
        className={'mobile-header-page-title'}
    >
        {pageHierarchy.openedPage.icon + ' ' + pageHierarchy.openedPage.title}
    </div>
})
